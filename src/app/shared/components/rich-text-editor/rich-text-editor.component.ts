import {
  Component,
  ElementRef,
  ViewChild,
  forwardRef,
  Input,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true,
    },
  ],
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
})
export class RichTextEditorComponent
  implements ControlValueAccessor, AfterViewInit, OnDestroy
{
  @Input() placeholder = 'Escribe aquí...';

  @ViewChild('editor', { static: false })
  editorEl!: ElementRef<HTMLDivElement>;

  disabled = false;
  isFullscreen = false;

  isBold = false;
  isItalic = false;
  isUnderline = false;
  isH1 = false;
  isH2 = false;
  isParagraph = false;
  isUnorderedList = false;
  isOrderedList = false;
  isAlignLeft = false;
  isAlignCenter = false;
  isAlignRight = false;
  isAlignJustify = false;
  currentFontSize = '';

  private initialValue: string | null = null;
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  private hasWarned5Mb = false;
  private hasWarned10Mb = false;

  ngOnDestroy(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  toggleFullscreen(): void {
    this.isFullscreen = !this.isFullscreen;

    if (typeof document !== 'undefined') {
      document.body.style.overflow = this.isFullscreen ? 'hidden' : '';
    }

    setTimeout(() => {
      this.focus();
      this.updateToolbarStates();
    }, 50);
  }

  setFontSize(event: Event): void {
    const select = event.target as HTMLSelectElement;
    if (select.value) {
      this.format('fontSize', select.value);
    }
  }

  updateToolbarStates(): void {
    if (typeof document === 'undefined') return;

    this.isBold = document.queryCommandState('bold');
    this.isItalic = document.queryCommandState('italic');
    this.isUnderline = document.queryCommandState('underline');
    this.isUnorderedList = document.queryCommandState('insertUnorderedList');
    this.isOrderedList = document.queryCommandState('insertOrderedList');
    this.isAlignLeft = document.queryCommandState('justifyLeft');
    this.isAlignCenter = document.queryCommandState('justifyCenter');
    this.isAlignRight = document.queryCommandState('justifyRight');
    this.isAlignJustify = document.queryCommandState('justifyFull');

    const fontSizeVal = document.queryCommandValue('fontSize');
    this.currentFontSize = fontSizeVal ? String(fontSizeVal) : '';

    const blockVal = document.queryCommandValue('formatBlock');
    this.isH1 = blockVal === 'h1' || this.isNodeTagName('H1');
    this.isH2 = blockVal === 'h2' || this.isNodeTagName('H2');
    this.isParagraph = blockVal === 'p' || (!this.isH1 && !this.isH2);
  }

  private isNodeTagName(tagName: string): boolean {
    if (typeof window === 'undefined') return false;

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      let container: Node | null = range.startContainer;

      while (container && container !== this.editorEl.nativeElement) {
        if (container.nodeName === tagName) {
          return true;
        }
        container = container.parentNode;
      }
    }

    return false;
  }

  ngAfterViewInit(): void {
    if (this.initialValue !== null && this.editorEl) {
      this.editorEl.nativeElement.innerHTML = this.initialValue;
      setTimeout(() => this.updateToolbarStates(), 0);
    }
  }

  format(command: string, value: string = ''): void {
    if (typeof document !== 'undefined') {
      document.execCommand(command, false, value);
      this.emitChange();
      this.updateToolbarStates();
    }
  }

  addLink(): void {
    if (typeof window !== 'undefined') {
      const url = prompt('Ingrese la URL del enlace:');
      if (url) {
        this.format('createLink', url);
      }
    }
  }

  focus(): void {
    if (this.editorEl && typeof document !== 'undefined') {
      this.editorEl.nativeElement.focus();
    }
  }

  onContainerClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.editor-toolbar')) {
      this.focus();
    }
  }

  onInput(): void {
    this.emitChange();
  }

  onBlur(): void {
    this.onTouched();
  }

  onPaste(event: ClipboardEvent): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const clipboardData = event.clipboardData;
    if (!clipboardData) return;

    const htmlData = clipboardData.getData('text/html') || '';
    const rtfData = clipboardData.getData('text/rtf') || '';

    const imageItems: DataTransferItem[] = [];
    for (let i = 0; i < clipboardData.items.length; i++) {
      const item = clipboardData.items[i];
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        imageItems.push(item);
      }
    }

    const isWordLikePaste =
      htmlData.includes('file://') ||
      htmlData.includes('cid:') ||
      htmlData.includes('v:imagedata') ||
      htmlData.includes('v:shape') ||
      htmlData.includes('mso-wrap-style') ||
      htmlData.includes('data:image/') ||
      rtfData.includes('\\pict') ||
      rtfData.includes('\\emfblip') ||
      rtfData.includes('\\wmetafile');

    if (isWordLikePaste) {
      event.preventDefault();
      this.processWordHtml(htmlData, imageItems, rtfData);
      return;
    }

    if (imageItems.length > 0 && !htmlData) {
      event.preventDefault();
      this.processDirectImagePaste(imageItems);
      return;
    }
  }

  private extractImagesFromRtf(rtfData: string): string[] {
    if (!rtfData) return [];

    const images: string[] = [];
    let startIndex = 0;

    while (true) {
      const pictStart = rtfData.indexOf('{\\pict', startIndex);
      if (pictStart === -1) break;

      let braceCount = 1;
      let i = pictStart + 6;
      let pictContent = '';

      while (i < rtfData.length && braceCount > 0) {
        const char = rtfData[i];
        if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
        }

        if (braceCount > 0) {
          pictContent += char;
        }
        i++;
      }

      startIndex = i;

      if (pictContent) {
        // Ignoramos formatos vectoriales (EMF/WMF/MacPict) que los navegadores no pueden renderizar natively.
        // Word siempre incluye una alternativa rasterizada (PNG/JPEG) en el RTF.
        if (
          pictContent.includes('\\emfblip') ||
          pictContent.includes('\\wmetafile') ||
          pictContent.includes('\\macpict')
        ) {
          continue;
        }

        let type = 'image/png';

        if (pictContent.includes('\\jpegblip')) {
          type = 'image/jpeg';
        } else if (pictContent.includes('\\pngblip')) {
          type = 'image/png';
        }

        let cleanText = pictContent;

        // Limpiar grupos anidados
        while (/\{[^{}]*\}/g.test(cleanText)) {
          cleanText = cleanText.replace(/\{[^{}]*\}/g, '');
        }

        // Limpiar palabras de control RTF
        cleanText = cleanText.replace(/\\\*/g, '');
        cleanText = cleanText.replace(/\\[a-zA-Z0-9'-]+/g, '');
        cleanText = cleanText.replace(/[{}]/g, '').replace(/[\r\n\s]/g, '');

        if (/^[0-9a-fA-F]{128,}$/.test(cleanText)) {
          try {
            const base64 = this.hexToBase64(cleanText);
            images.push(`data:${type};base64,${base64}`);
          } catch (err) {
            console.error('Error converting RTF hex to base64:', err);
          }
        }
      }
    }

    return images;
  }

  private hexToBase64(hexString: string): string {
    const bytes = new Uint8Array(hexString.length / 2);

    for (let i = 0; i < hexString.length; i += 2) {
      bytes[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
    }

    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return window.btoa(binary);
  }

  private isValidImageSrc(src: string): boolean {
    return (
      src.startsWith('data:image/') ||
      src.startsWith('http://') ||
      src.startsWith('https://') ||
      src.startsWith('/uploads/') ||
      src.startsWith('assets/')
    );
  }

  private isWordVmlElement(el: Element): boolean {
    const name = (el.localName || el.tagName || '').toLowerCase();
    return (
      name === 'shape' ||
      name === 'shapetype' ||
      name === 'imagedata' ||
      name.includes(':shape') ||
      name.includes(':shapetype') ||
      name.includes(':imagedata')
    );
  }

  private isWordShapeElement(el: Element): boolean {
    const name = (el.localName || el.tagName || '').toLowerCase();
    return name === 'shape' || name.includes(':shape');
  }

  private getNextElementSibling(node: Node | null): Element | null {
    let current = node?.nextSibling || null;

    while (current) {
      if (current.nodeType === Node.ELEMENT_NODE) {
        return current as Element;
      }
      current = current.nextSibling;
    }

    return null;
  }

  private applyWordImageStyle(
    img: HTMLImageElement,
    shape: Element
  ): void {
    const shapeStyle = shape.getAttribute('style') || '';
    const style = shapeStyle.toLowerCase();

    const shapeAlign = (shape.getAttribute('align') || '').toLowerCase();
    const shapeXAlign = (shape.getAttribute('o:xalign') || shape.getAttribute('xalign') || '').toLowerCase();
    const imgAlign = (img.getAttribute('align') || '').toLowerCase();
    const align = shapeAlign || shapeXAlign || imgAlign;

    img.style.display = 'block';
    img.style.maxWidth = '100%';
    img.style.height = 'auto';

    // 1) Si la alineación explícita es a la derecha (vía align o estilos de posición horizontal de MSO)
    const isRightAligned = 
      align === 'right' || 
      style.includes('mso-position-horizontal:right') ||
      style.includes('mso-position-horizontal: right') ||
      style.includes('float:right') ||
      style.includes('float: right');

    const isLeftAligned =
      align === 'left' ||
      style.includes('mso-position-horizontal:left') ||
      style.includes('mso-position-horizontal: left') ||
      style.includes('float:left') ||
      style.includes('float: left');

    const isCentered =
      align === 'center' ||
      style.includes('mso-position-horizontal:center') ||
      style.includes('mso-position-horizontal: center');

    // 2) Si tiene estilos de ajuste (wrap) de Word o alineación de flotación
    const hasWrapStyle =
      style.includes('mso-wrap-style:square') ||
      style.includes('mso-wrap-style:tight') ||
      style.includes('mso-wrap-style:through') ||
      align === 'right' ||
      align === 'left';

    if (hasWrapStyle) {
      if (isRightAligned && !isLeftAligned) {
        img.style.float = 'right';
        img.style.margin = '10px 0 10px 16px';
      } else {
        // Por defecto para square/tight flotamos a la izquierda si no está alineado a la derecha
        img.style.float = 'left';
        img.style.margin = '10px 16px 10px 0';
      }
    } else if (isRightAligned) {
      img.style.float = 'right';
      img.style.margin = '10px 0 10px 16px';
    } else if (isCentered) {
      img.style.display = 'block';
      img.style.margin = '10px auto';
    } else {
      img.style.margin = '10px 0';
    }
  }

  private cleanWordStyles(style: string): string {
    return (
      style
        .replace(/mso-[^:]+:[^;]+;/gi, '')
        .replace(/position:absolute/gi, 'position:relative')
        .replace(/z-index:[^;]+;/gi, '')
        .replace(/left:[^;]+;/gi, '')
        .replace(/top:[^;]+;/gi, '')
        .replace(/width:[^;]+;/gi, '')
        .replace(/height:[^;]+;/gi, '') +
      ';max-width:100%;height:auto;margin:10px;'
    );
  }

  private processWordHtml(
    htmlData: string,
    imageItems: DataTransferItem[],
    rtfData: string
  ): void {
    if (typeof window === 'undefined') return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlData, 'text/html');

    const allElements = Array.from(doc.getElementsByTagName('*'));

    // 1) Convertir VML de Word a imágenes normales si existe fallback base64
    const shapes = allElements.filter((el) => this.isWordShapeElement(el));
    const usedFallbackImgs = new Set<HTMLImageElement>();

    for (const shape of shapes) {
      const shapeStyle = shape.getAttribute('style') || '';

      // Word suele poner un tag <img> de respaldo (con base64 o ruta local file:///) después de la forma VML
      let sibling = shape.nextSibling;
      let fallbackImg: HTMLImageElement | null = null;

      while (sibling) {
        if (sibling.nodeType === Node.ELEMENT_NODE) {
          const el = sibling as Element;
          if (el.tagName.toLowerCase() === 'img') {
            const img = el as HTMLImageElement;
            if (!usedFallbackImgs.has(img)) {
              fallbackImg = img;
              break;
            }
          }
        }
        sibling = sibling.nextSibling;
      }

      if (fallbackImg) {
        this.applyWordImageStyle(fallbackImg, shape);
        usedFallbackImgs.add(fallbackImg);
      }

      // Eliminamos el VML para que Opera/Chrome no intente cargar file://
      shape.remove();
    }

    // 2) Eliminar cualquier VML residual
    Array.from(doc.getElementsByTagName('*'))
      .filter((el) => this.isWordVmlElement(el))
      .forEach((el) => el.remove());

    // 3) Trabajar solo con imágenes estándar
    const imgs = Array.from(doc.querySelectorAll('img')) as HTMLImageElement[];

    const localImgs = imgs.filter((img) => {
      const src = (img.getAttribute('src') || '').trim();

      // Dejamos intacto data:image y http(s)
      if (this.isValidImageSrc(src)) return false;

      return (
        src.startsWith('file://') ||
        src.startsWith('cid:') ||
        src.startsWith('blob:') ||
        src === ''
      );
    });

    // 4) Si hay imágenes locales, intentar reemplazarlas por RTF usando correspondencia secuencial 1-a-1
    if (localImgs.length > 0) {
      const rtfImages = this.extractImagesFromRtf(rtfData);

      if (rtfImages.length > 0) {
        let rtfIndex = 0;

        for (let i = 0; i < imgs.length; i++) {
          const img = imgs[i];
          const src = (img.getAttribute('src') || '').trim();

          if (this.isValidImageSrc(src)) {
            // Ya es válida en el HTML. Avanzamos el puntero del RTF si corresponde
            rtfIndex++;
            continue;
          }

          // Es local/inválida. Intentamos rellenarla con la imagen secuencial del RTF.
          if (rtfIndex < rtfImages.length) {
            img.setAttribute('src', rtfImages[rtfIndex]);
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            rtfIndex++;
          }
        }

        // Eliminar las que sigan siendo inválidas
        Array.from(doc.querySelectorAll('img')).forEach((img) => {
          const src = (img.getAttribute('src') || '').trim();
          if (!this.isValidImageSrc(src)) {
            img.remove();
          }
        });

        this.insertHtmlAtCursor(doc.body.innerHTML);
        return;
      }

      // 5) Si el clipboard trae archivos de imagen, usarlos como fallback usando correspondencia secuencial 1-a-1
      if (imageItems.length > 0) {
        const readAndReplace = (imgIndex: number, clipIndex: number) => {
          if (imgIndex >= imgs.length || clipIndex >= imageItems.length) {
            // Si aún hay imágenes inválidas, eliminarlas
            Array.from(doc.querySelectorAll('img')).forEach((img) => {
              const src = (img.getAttribute('src') || '').trim();
              if (!this.isValidImageSrc(src)) {
                img.remove();
              }
            });

            this.insertHtmlAtCursor(doc.body.innerHTML);
            return;
          }

          const img = imgs[imgIndex];
          const src = (img.getAttribute('src') || '').trim();

          if (this.isValidImageSrc(src)) {
            readAndReplace(imgIndex + 1, clipIndex + 1);
            return;
          }

          const item = imageItems[clipIndex];
          const file = item.getAsFile();

          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const base64Url = e.target?.result as string;
              img.setAttribute('src', base64Url);
              img.style.maxWidth = '100%';
              img.style.height = 'auto';
              readAndReplace(imgIndex + 1, clipIndex + 1);
            };
            reader.readAsDataURL(file);
          } else {
            readAndReplace(imgIndex + 1, clipIndex);
          }
        };

        readAndReplace(0, 0);
        return;
      }

      // 6) Si no hay forma de reemplazar, quitar solo las inválidas
      localImgs.forEach((img) => img.remove());
    }

    // 7) Limpiar cualquier src inválido remanente antes de insertar
    Array.from(doc.querySelectorAll('img')).forEach((img) => {
      const src = (img.getAttribute('src') || '').trim();
      if (!this.isValidImageSrc(src)) {
        img.remove();
      } else {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
      }
    });

    this.insertHtmlAtCursor(doc.body.innerHTML);
  }

  private processDirectImagePaste(imageItems: DataTransferItem[]): void {
    if (imageItems.length === 0) return;

    const file = imageItems[0].getAsFile();
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Url = e.target?.result as string;
        const imgHtml = `<img src="${base64Url}" style="max-width: 100%; height: auto;" />`;
        this.insertHtmlAtCursor(imgHtml);
      };
      reader.readAsDataURL(file);
    }
  }

  private insertHtmlAtCursor(html: string): void {
    if (typeof window === 'undefined' || typeof document === 'undefined')
      return;

    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
      if (this.editorEl) {
        this.editorEl.nativeElement.innerHTML += html;
        this.emitChange();
      }
      return;
    }

    const range = selection.getRangeAt(0);
    let container: Node | null = range.startContainer;
    let isInsideEditor = false;

    while (container) {
      if (container === this.editorEl.nativeElement) {
        isInsideEditor = true;
        break;
      }
      container = container.parentNode;
    }

    if (!isInsideEditor) {
      if (this.editorEl) {
        this.editorEl.nativeElement.innerHTML += html;
        this.emitChange();
      }
      return;
    }

    range.deleteContents();

    const el = document.createElement('div');
    el.innerHTML = html;

    const frag = document.createDocumentFragment();
    let node: Node | null;
    let lastNode: Node | null = null;

    while ((node = el.firstChild)) {
      lastNode = frag.appendChild(node);
    }

    range.insertNode(frag);

    if (lastNode) {
      const newRange = range.cloneRange();
      newRange.setStartAfter(lastNode);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }

    this.emitChange();
  }

  private emitChange(): void {
    if (!this.editorEl) return;

    const html = this.editorEl.nativeElement.innerHTML;

    if (html === '<br>' || html === '' || html === '<div><br></div>') {
      this.onChange('');
    } else {
      this.onChange(html);
    }
  }


  writeValue(value: string | null): void {
    const normalized = value || '';

    if (this.editorEl) {
      this.editorEl.nativeElement.innerHTML = normalized;
      setTimeout(() => this.updateToolbarStates(), 0);
    } else {
      this.initialValue = normalized;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
} 