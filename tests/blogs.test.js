const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('localhost:3000');
});

afterEach(async () => {
  await page.close();
});

describe('When logged in', async () => {
  beforeEach(async () => {
    await page.login();
    await page.click('a.btn-floating.btn-large.red');
  });

  test('can see blog create form', async () => {
    const label = await page.getHTML('form label');
    expect(label).toEqual('Blog Title');
  });

  describe('And using valid inputs', async () => {
    beforeEach(async () => {
      await page.type('.title input[name="title"]', 'Test title');
      await page.type('.content input[name="content"]', 'Test content');
      await page.click('form button[type="submit"]');
    });

    test('submitting takes user to review screen', async () => {
      const text = await page.getHTML('h5');

      expect(text).toEqual('Please confirm your entries');
    });

    test('submitting then saving adds blog to index page', async () => {
      await page.click('button.green');
      await page.waitFor(
        () => window.location.href === 'http://localhost:3000/blogs'
      );

      const title = await page.getHTML('.card-title');
      const content = await page.getHTML('.card-content p');

      expect(title).toEqual('Test title');
      expect(content).toEqual('Test content');
    });
  });

  describe('And using invalid inputs', async () => {
    beforeEach(async () => {
      await page.click('form button[type="submit"]');
    });

    test('the form shows an error message', async () => {
      const titleErr = await page.getHTML('.title .red-text');
      const contentErr = await page.getHTML('.content .red-text');

      expect(titleErr).toEqual('You must provide a value');
      expect(contentErr).toEqual('You must provide a value');
    });
  });
});

describe('When not logged in', async () => {
  const actions = [
    {
      method: 'get',
      path: '/api/blogs'
    },
    {
      method: 'post',
      path: '/api/blogs',
      data: {
        title: 'T',
        content: 'C'
      }
    }
  ];

  test('Blog related actions are prohibited', async () => {
    const results = await page.execRequest(actions);
    for (let result of results) {
      expect(result).toEqual({ error: 'You must log in!' });
    }
  });
});
