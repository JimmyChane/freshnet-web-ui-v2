interface PrintOption {
  printMode?: string;
  pageTitle?: string;
  templateString?: string;
  popupProperties?: string;
  stylesheets?: unknown;
  styles?: unknown;
}

export function printElement(element: HTMLElement, opts?: PrintOption) {
  const elementHtml = element.outerHTML;

  _print(elementHtml, opts);
}

export function printHtml(html: string, opts?: PrintOption) {
  _print(html, opts);
}

function _print(html: string, options?: PrintOption) {
  const opts: Required<PrintOption> = {
    printMode: options?.printMode ?? '',
    pageTitle: options?.pageTitle ?? '',
    templateString: options?.templateString ?? '',
    popupProperties: options?.popupProperties ?? '',
    stylesheets: options?.stylesheets ?? null,
    styles: options?.styles ?? null,
  };

  // Get markup to be printed
  let markup = _getMarkup(html, opts);
  let printWindow: HTMLIFrameElement | Window | null;
  let printIframe: HTMLIFrameElement | null = null;
  let printDocument: Document | null;
  let printElementID: string;

  if (opts.printMode.toLowerCase() === 'popup') {
    printWindow = window.open('about:blank', 'printElementWindow', opts.popupProperties);
    printDocument = printWindow?.document ?? null;
  } else {
    //The random ID is to overcome a safari bug
    // http://www.cjboco.com.sharedcopy.com/post.cfm/442dc92cd1c0ca10a5c35210b8166882.html
    printElementID = 'printElement_' + Math.round(Math.random() * 99999).toString();

    printIframe = document.createElement('iframe');
    printIframe.setAttribute('id', printElementID);
    printIframe.setAttribute('src', 'about:blank');
    printIframe.setAttribute('frameBorder', '0');
    printIframe.setAttribute('scrolling', 'no');
    printIframe.setAttribute('style', 'position:fixed;bottom:100%;right:100%;');

    document.body.appendChild(printIframe);

    const x = printIframe.contentWindow || printIframe.contentDocument;
    printDocument = x instanceof Window || x instanceof HTMLIFrameElement ? x.document : x;

    printIframe =
      'frames' in document && typeof document.frames === 'object' && document.frames
        ? (document.frames as Record<string, any>)[printElementID]
        : document.getElementById(printElementID);
    printWindow = printIframe?.contentWindow || printIframe;
  }

  focus();
  printDocument?.open();

  // SetTimeout fixes Issue #9 (iframe printMode does not work in firefox)
  setTimeout(function () {
    printDocument?.write(markup);
    printDocument?.close();
  });

  callPrint(printWindow, printIframe);
}

function callPrint(
  printWindow: HTMLIFrameElement | Window | null,
  iframe: HTMLIFrameElement | null,
) {
  if (printWindow && 'printPage' in printWindow && typeof printWindow.printPage === 'function') {
    printWindow.printPage();

    if (iframe) {
      // Remove iframe after printing
      document.body.removeChild(iframe);
    }
  } else {
    setTimeout(function () {
      callPrint(printWindow, iframe);
    }, 50);
  }
}

function _getBaseHref() {
  var port = window.location.port ? ':' + window.location.port : '';
  return (
    window.location.protocol + '//' + window.location.hostname + port + window.location.pathname
  );
}

function _getMarkup(elementHtml: string, opts: Required<PrintOption>) {
  var template = opts.templateString,
    templateRegex = new RegExp(/{{\s*printBody\s*}}/gi),
    stylesheets,
    styles,
    html = [];

  if (template && templateRegex.test(template)) {
    elementHtml = template.replace(templateRegex, elementHtml);
  }

  html.push('<html><head><title>' + (opts.pageTitle || '') + '</title>');

  // If stylesheet URL's or list of stylesheet URL's are specified, override page stylesheets
  if (opts.stylesheets) {
    stylesheets = Array.isArray(opts.stylesheets) ? opts.stylesheets : [opts.stylesheets];
  } else {
    stylesheets = Array.prototype.slice
      .call(document.getElementsByTagName('link'))
      .map(function (link) {
        return link.href;
      });
  }

  stylesheets.forEach(function (href) {
    html.push('<link rel="stylesheet" href="' + href + '">');
  });

  // If inline styles or list of inline styles are specified, override inline styles
  if (opts.styles) {
    styles = Array.isArray(opts.styles) ? opts.styles : [opts.styles];
  } else {
    styles = Array.prototype.slice
      .call(document.getElementsByTagName('style'))
      .map(function (style) {
        return style.innerHTML;
      });
  }

  styles.forEach(function (style) {
    html.push('<style type="text/css">' + style + '</style>');
  });

  // Ensure that relative links work
  html.push('<base href="' + _getBaseHref() + '" />');
  html.push('</head><body class="pe-body">');
  html.push(elementHtml);
  html.push(
    '<script type="text/javascript">function printPage(){focus();print();' +
      (opts.printMode.toLowerCase() == 'popup' ? 'close();' : '') +
      '}</script>',
  );
  html.push('</body></html>');

  return html.join('');
}
