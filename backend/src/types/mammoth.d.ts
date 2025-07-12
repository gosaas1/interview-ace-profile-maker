declare module 'mammoth' {
  interface ExtractResult {
    value: string;
    messages: Array<{
      type: string;
      message: string;
      paragraph?: number;
    }>;
  }

  interface Options {
    styleMap?: string;
    includeDefaultStyleMap?: boolean;
    includeEmbeddedStyleMap?: boolean;
    idPrefix?: string;
    transformDocument?: (document: any) => any;
    ignoreEmptyParagraphs?: boolean;
    idPrefix?: string;
    convertImage?: (image: any) => Promise<any>;
  }

  function extractRawText(options: { path: string } | { buffer: Buffer }, extractOptions?: Options): Promise<ExtractResult>;
  function convertToHtml(options: { path: string } | { buffer: Buffer }, convertOptions?: Options): Promise<ExtractResult>;
  function convertToMarkdown(options: { path: string } | { buffer: Buffer }, convertOptions?: Options): Promise<ExtractResult>;

  export = {
    extractRawText,
    convertToHtml,
    convertToMarkdown,
  };
} 