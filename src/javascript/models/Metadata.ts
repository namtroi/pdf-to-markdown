// Metadata of the PDF document
interface MetadataInput {
  metadata?: Map<string, any>;
  info?: {
    Title?: string;
    Author?: string;
    Creator?: string;
    Producer?: string;
  };
}

export class Metadata {
  title?: string;
  author?: string;
  creator?: string;
  producer?: string;

  constructor(originalMetadata: MetadataInput) {
    if (originalMetadata.metadata) {
      this.title = originalMetadata.metadata.get('dc:title');
      this.creator = originalMetadata.metadata.get('xap:creatortool');
      this.producer = originalMetadata.metadata.get('pdf:producer');
    } else if (originalMetadata.info) {
      this.title = originalMetadata.info.Title;
      this.author = originalMetadata.info.Author;
      this.creator = originalMetadata.info.Creator;
      this.producer = originalMetadata.info.Producer;
    }
  }
}
