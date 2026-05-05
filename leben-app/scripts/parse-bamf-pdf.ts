/**
 * Parses the official BAMF PDF into JSON question format.
 * Usage: npx ts-node scripts/parse-bamf-pdf.ts <path-to-pdf>
 *
 * Download PDF from:
 * https://www.bamf.de/SharedDocs/Anlagen/DE/Integration/Einbuergerung/gesamtfragenkatalog-lebenindeutschland.pdf
 */
import * as fs from 'fs';
import * as path from 'path';

// npm install pdf-parse @types/pdf-parse
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require('pdf-parse');

interface RawQuestion {
  id: number;
  land: string;
  number: number;
  question_de: string;
  answers_de: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  explanation_de: string;
  category: string;
  translations: Record<string, unknown>;
}

async function parsePDF(pdfPath: string): Promise<RawQuestion[]> {
  const buffer = fs.readFileSync(pdfPath);
  const data = await pdfParse(buffer);
  const text: string = data.text;

  const questions: RawQuestion[] = [];
  // PDF parsing logic — each question block starts with a number like "1." or "301."
  const blocks = text.split(/\n(?=\d{1,3}\s)/);

  let id = 1;
  for (const block of blocks) {
    const lines = block.trim().split('\n').filter(Boolean);
    if (lines.length < 6) continue;

    // First line: question number + question text
    const numberMatch = lines[0].match(/^(\d+)\s+(.*)/);
    if (!numberMatch) continue;

    const number = parseInt(numberMatch[1], 10);
    const questionText = [numberMatch[2], ...lines.slice(1, 3)].join(' ').trim();

    // Look for answer lines (marked with letters or bullets)
    const answerLines: string[] = [];
    let correctIdx: 0 | 1 | 2 | 3 = 0;

    for (let i = 1; i < lines.length; i++) {
      // Correct answer often marked differently — heuristic: first option or marked with *
      if (/^[*●►]/.test(lines[i])) {
        correctIdx = answerLines.length as 0 | 1 | 2 | 3;
        answerLines.push(lines[i].replace(/^[*●►]\s*/, '').trim());
      } else if (answerLines.length < 4) {
        answerLines.push(lines[i].trim());
      }
    }

    if (answerLines.length < 4) continue;

    questions.push({
      id: id++,
      land: 'general',
      number,
      question_de: questionText,
      answers_de: answerLines.slice(0, 4) as [string, string, string, string],
      correct: correctIdx,
      explanation_de: '',
      category: '',
      translations: {},
    });
  }

  return questions;
}

async function main() {
  const pdfPath = process.argv[2];
  if (!pdfPath) {
    console.error('Usage: npx ts-node scripts/parse-bamf-pdf.ts <path-to-pdf>');
    process.exit(1);
  }

  console.log(`Parsing ${pdfPath}...`);
  const questions = await parsePDF(pdfPath);
  console.log(`Found ${questions.length} questions`);

  const outPath = path.join(__dirname, '../src/data/questions/general.json');
  fs.writeFileSync(outPath, JSON.stringify(questions, null, 2), 'utf-8');
  console.log(`Saved to ${outPath}`);
}

main().catch(console.error);
