// Downloader.tsx
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
import { writePsd } from "ag-psd";
import htmlToPdfmake from "html-to-pdfmake";
import { useToast } from "@/hooks/use-toast";

// SELECT
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { resolve } from "dns";

export type DownloaderProps = {
  labelRef: any;
};

const Downloader: React.FC<DownloaderProps> = ({ labelRef }) => {
  const { toast } = useToast();

  async function handleDownload(format: string) {
    if (!labelRef.current) return;

    try {
      toast({
        title: "Processing",
        description: `Preparing ${format} download...`,
      });

      const widthPx = labelRef.current.offsetWidth;
      const heightPx = labelRef.current.offsetHeight;

      const waitForResources = async () => {
        await document.fonts.ready;
        await Promise.all(
          Array.from(document.images).map((img) =>
            img.complete
              ? Promise.resolve()
              : new Promise((r) => (img.onload = img.onerror = r)),
          ),
        );
      };

      if (format == "png") {
        await waitForResources();
        labelRef.current.style.background = "transparent";

        const dataUrl = await domtoimage.toPng(labelRef.current, {
          width: widthPx,
          height: heightPx,
          style: {
            background: "transparent",
          },
          bgcolor: "transparent",
        });

        const res = await fetch(dataUrl);
        const blob = await res.blob();
        saveAs(blob, "label.png");
      } else if (format == "jpg") {
        await waitForResources();
        const dataUrl = await domtoimage.toJpeg(labelRef.current, {
          width: widthPx,
          height: heightPx,
          style: {
            background: "white",
          },
          bgcolor: "white",
          quality: 0.95,
        });

        // To trigger download:
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "label.jpg";
        link.click();
      } else if (format == "pdf") {
        
        await waitForResources();

        if (!labelRef.current) return;

        const labelElement = labelRef.current;

        // Step 1: Extract all non-cross-origin CSS into a string
        let cssText = "";
        const styleSheets = Array.from(document.styleSheets);
        try {
          styleSheets.forEach((sheet) => {
            try {
              // Skip cross-origin sheets
              if (
                !sheet.href ||
                sheet.href.startsWith(window.location.origin)
              ) {
                if (sheet.cssRules) {
                  Array.from(sheet.cssRules).forEach((rule) => {
                    cssText += rule.cssText + "\n";
                  });
                }
              }
            } catch (e) {
              console.log('css not found');
            }
          });
        } catch (e) {
          console.warn("Could not extract all CSS rules");
        }

        // Step 2: Inline computed styles (optional, but can help)
        let inlineStyles = "";
        const computedStyle = window.getComputedStyle(labelElement);
        for (let i = 0; i < computedStyle.length; i++) {
          const property = computedStyle[i];
          const value = computedStyle.getPropertyValue(property);
          inlineStyles += `${property}: ${value}; `;
        }

        // Step 3: Build the HTML to send to the backend
        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <title>Nutrition Label</title>
              <style>
                ${cssText}
                * { box-sizing: border-box; }
                body { 
                  margin: 0; 
                  padding: 0; 
                  background: white;
                }
              </style>
            </head>
            <body>
              ${labelElement.outerHTML.replace(
                "<div",
                `<div id="label-container" style="${inlineStyles}"`,
              )}
            </body>
          </html>
        `;
        const API_BASE_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`/Nutrition-labeler/api/receive`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ html: htmlContent, width: `${widthPx}px`, height: `${heightPx}px` }),
        });

        console.log(response);

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = 'label.pdf';
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);

          alert('Success! PDF saved to your downloads folder.');
          
        } else {
          alert("Failed to generate PDF.");
        }


        // const response = await fetch("https://praco.gfxfinder.com/api/receive", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json"
        //   },
        //   body: JSON.stringify({
        //     html: htmlContent,
        //     width: `${widthPx+2}px`,
        //     height: `${heightPx+5}px`
        //   })
        // });

        // console.log(response);

        // if (response.ok) {
        //   const data = await response.json();
        //   alert("API response: " + JSON.stringify(data));
        // } else {
        //   alert("Failed to send HTML to API.");
        // }

      } else if (format == "svg") {
        await waitForResources();
        const svgElement = labelRef.current.querySelector("svg");

        if (svgElement) {
          // Clean inline SVG
          const serializer = new XMLSerializer();
          const svgContent = serializer.serializeToString(svgElement);

          // Add XML header for proper SVG formatting
          const svgWithHeader = `<?xml version="1.0" encoding="UTF-8"?>\n${svgContent}`;

          const blob = new Blob([svgWithHeader], {
            type: "image/svg+xml;charset=utf-8",
          });
          const url = URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.download = "label.svg";
          link.click();
          URL.revokeObjectURL(url);
        } else {
          toast({
            title: "Error",
            description: "No SVG element found inside label.",
            variant: "destructive",
          });
        }
      } else if (format == "psd") {
        await waitForResources();
        // Render the element to a high-res canvas
        const canvas = await html2canvas(labelRef.current, {
          backgroundColor: null,
        });
        const { width, height } = canvas;

        // Build a PSD with a single layer that uses the canvas directly
        const psd = {
          width,
          height,
          children: [
            {
              name: "Layer 1",
              top: 0,
              left: 0,
              bottom: height,
              right: width,
              canvas,
            },
          ],
        };

        // Serialize and save
        const buffer = writePsd(psd);
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        saveAs(blob, "label.psd");
      } else if (format == "ai") {
        await waitForResources();
        const el = labelRef.current;
        const html = el.innerHTML;
        const content = htmlToPdfmake(html, { window });
        const docDef: any = {
          pageSize: { width: widthPx, height: heightPx },
          pageMargins: [0, 0, 0, 0],
          defaultStyle: { font: "Arial" },
          content,
        };
        pdfMake.createPdf(docDef).download("label.ai");
      }

      // SUCCESS NOTE
      toast({
        title: "Success",
        description: `Downloaded label as ${format.toUpperCase()}`,
      });
    } catch (error) {
      // FAILURE NOTE
      console.error("Download error:", error);
      toast({
        title: "Error",
        description: "Failed to download the label. Please try again.",
        variant: "destructive",
      });
    }
  }

  const [fileFormat, setFileFormat] = useState("png");

  return (
    <>
      <div className="bg-gray-100 py-4 px-8 mt-4" style={{ maxWidth: "350px" }}>
        <h3 className="text-sm font-medium text-gray-700">
          Download File Format:
        </h3>
        <div className="py-2">
          <Select value={fileFormat} onValueChange={setFileFormat}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpg">JPG</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              {/* <SelectItem value="svg">SVG</SelectItem> */}
              {/* <SelectItem value="psd">PSD</SelectItem> */}
              {/* <SelectItem value="ai">AI</SelectItem> */}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end mt-2">
          <Button onClick={() => handleDownload(fileFormat)}>
            Download {fileFormat.toUpperCase()}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Downloader;
