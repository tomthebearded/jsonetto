import { Component, EventEmitter, Output } from '@angular/core';
import { JsonService } from 'src/app/src/services/json.service';

@Component({
  selector: 'import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent {
  public value?: string | null;
  @Output() importSucceded = new EventEmitter<boolean>();

  constructor(private jsonService: JsonService) {
  }

  import(): void {
    if (!this.value?.trim())
      return;

    this.importSucceded.next(this.jsonService.import(this.value));
  }

  onFiledrop(event: any): void {
    if (!event?.target?.files || event.target.files > 1)
      return;

    if (!this.validateExtensions(event.target.files[0]))
      this.importSucceded.next(false);

    const reader = new FileReader();
    reader.addEventListener('load', event =>
      this.importSucceded.next(this.jsonService.import(event?.target?.result?.toString()))
    );
    reader.readAsText(event.target.files[0]);
  }

  private validateExtensions(file: File): boolean {
    let extension = file?.name?.toLowerCase().match(/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi)?.[0]
    return extension === '.json';
  }
}
