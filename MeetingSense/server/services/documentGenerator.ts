import fs from "fs";
import path from "path";
import { BRDContent } from "@shared/schema";

export async function generatePDF(brdContent: BRDContent, outputPath: string): Promise<void> {
  // For now, generate a simple text-based PDF content
  // In a real implementation, you would use a library like pdfkit
  const content = generateDocumentContent(brdContent);
  
  // Create a simple text file that represents the PDF content
  // This would be replaced with actual PDF generation
  await fs.promises.writeFile(outputPath, content, 'utf8');
}

export async function generateDOCX(brdContent: BRDContent, outputPath: string): Promise<void> {
  // For now, generate a simple text-based DOCX content
  // In a real implementation, you would use a library like docx
  const content = generateDocumentContent(brdContent);
  
  // Create a simple text file that represents the DOCX content
  // This would be replaced with actual DOCX generation
  await fs.promises.writeFile(outputPath, content, 'utf8');
}

function generateDocumentContent(brdContent: BRDContent): string {
  return `
BUSINESS REQUIREMENTS DOCUMENT
${brdContent.title}
${brdContent.subtitle}

1. PROJECT OVERVIEW
${brdContent.projectOverview}

2. BUSINESS OBJECTIVES
${brdContent.businessObjectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

3. SCOPE & DELIVERABLES

In Scope:
${brdContent.scope.inScope.map(item => `• ${item}`).join('\n')}

Out of Scope:
${brdContent.scope.outOfScope.map(item => `• ${item}`).join('\n')}

4. FUNCTIONAL REQUIREMENTS
${brdContent.functionalRequirements.map(req => 
  `${req.id}: ${req.title}
  Description: ${req.description}
  Priority: ${req.priority.toUpperCase()}
  `).join('\n')}

5. NON-FUNCTIONAL REQUIREMENTS
${brdContent.nonFunctionalRequirements.map(req => 
  `${req.id}: ${req.title}
  Category: ${req.category}
  Description: ${req.description}
  `).join('\n')}

6. STAKEHOLDERS
${brdContent.stakeholders.map(stakeholder => 
  `• ${stakeholder.name} (${stakeholder.role})
    Responsibility: ${stakeholder.responsibility}`).join('\n')}

7. CONSTRAINTS & ASSUMPTIONS

Constraints:
${brdContent.constraints.map(constraint => `• ${constraint}`).join('\n')}

Assumptions:
${brdContent.assumptions.map(assumption => `• ${assumption}`).join('\n')}
`;
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}
