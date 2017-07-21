import { FirebaseDemoPage } from './app.po';

describe('firebase-demo App', () => {
  let page: FirebaseDemoPage;

  beforeEach(() => {
    page = new FirebaseDemoPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
