import { CodeTestAngular4Page } from './app.po';

describe('code-test-angular4 App', () => {
  let page: CodeTestAngular4Page;

  beforeEach(() => {
    page = new CodeTestAngular4Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
