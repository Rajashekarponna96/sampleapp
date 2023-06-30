import { TestBed } from '@angular/core/testing';

import { SendHTMLInvoiceLinkService } from './send-htmlinvoice-link.service';

describe('SendHTMLInvoiceLinkService', () => {
  let service: SendHTMLInvoiceLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendHTMLInvoiceLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
