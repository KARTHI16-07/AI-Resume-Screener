package com.resumescreener.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;

@Service
public class ResumeParserService {

    public String extractText(File file) {
        if (file == null || !file.exists()) {
            return "";
        }

        String fileName = file.getName().toLowerCase();
        try {
            if (fileName.endsWith(".pdf")) {
                try (PDDocument document = Loader.loadPDF(file)) {
                    PDFTextStripper stripper = new PDFTextStripper();
                    return stripper.getText(document);
                }
            } else if (fileName.endsWith(".docx")) {
                try (FileInputStream fis = new FileInputStream(file);
                     XWPFDocument document = new XWPFDocument(fis);
                     XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {
                    return extractor.getText();
                }
            }
        } catch (Exception e) {
            // Log error, but don't fail entirely. Return empty string so processing can continue.
            System.err.println("Error extracting text from file " + fileName + ": " + e.getMessage());
        }

        return "";
    }
}
