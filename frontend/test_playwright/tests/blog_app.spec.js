const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Yaroslav Romashko',
        username: 'yaroslav',
        password: '123'
      }
    })

    await page.goto('/')

    await request.post('/api/users', {
      data: {
        name: 'Ruslan Ivanov',
        username: 'ruslan',
        password: '123'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Log in to application')
    await expect(locator).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('yaroslav')
      await page.getByTestId('password').fill('123')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Yaroslav Romashko logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('yaroslav')
      await page.getByTestId('password').fill('000')
      await page.getByRole('button', { name: 'login' }).click()
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
    })
  })

  test('a new blog can be created', async ({ page }) => {
    await page.getByTestId('username').fill('yaroslav')
    await page.getByTestId('password').fill('123')
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.locator('#title').fill('new title')
    await page.locator('#author').fill('new author')
    await page.locator('#url').fill('new url')
    await page.getByRole('button', { name: 'create' }).click()
    await page.getByText('New blog new title by author new author').click()
    await expect(page.getByText('new title - new author view')).toBeVisible()
  })

  test('a new blog can be edited', async ({ page }) => {
    await page.getByTestId('username').fill('yaroslav')
    await page.getByTestId('password').fill('123')
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.locator('#title').fill('new title')
    await page.locator('#author').fill('new author')
    await page.locator('#url').fill('new url')
    await page.getByRole('button', { name: 'create' }).click()
    await page.getByRole('button', { name: 'view' }).click()
    await expect(page.getByText('likes 0 like')).toBeVisible()
    await page.getByRole('button', { name: 'like' }).click()
    await expect(page.getByText('likes 1 like')).toBeVisible()
  })

  test('existing blog can be deleted', async ({ page }) => {
    await page.getByTestId('username').fill('yaroslav')
    await page.getByTestId('password').fill('123')
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.locator('#title').fill('new title')
    await page.locator('#author').fill('new author')
    await page.locator('#url').fill('new url')
    await page.getByRole('button', { name: 'create' }).click()
    await page.getByRole('button', { name: 'view' }).click()
    await expect(page.getByText('Yaroslav Romashkoremove blog')).toBeVisible()
    page.once('dialog', dialog => {
      console.log(`Dialog message: ${dialog.message()}`)
      dialog.accept().catch(() => {})
    })
    await page.getByRole('button', { name: 'remove blog' }).click()
    await page.waitForTimeout(100)
    await expect(page.getByText('new title - new author')).not.toBeVisible()
  })

  test('user can see delete button only for his own blog', async ({ page }) => {
    await page.getByTestId('username').fill('yaroslav')
    await page.getByTestId('password').fill('123')
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.locator('#title').fill('new title')
    await page.locator('#author').fill('new author')
    await page.locator('#url').fill('new url')
    await page.getByRole('button', { name: 'create' }).click()
    await page.getByText('New blog new title by author new author')
    await expect(page.getByText('new title - new author view')).toBeVisible()
    await page.getByRole('button', { name: 'logout' }).click()

    await page.getByTestId('username').fill('ruslan')
    await page.getByTestId('password').fill('123')
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.locator('#title').fill('new title 1')
    await page.locator('#author').fill('new author 1')
    await page.locator('#url').fill('new url 1')
    await page.getByRole('button', { name: 'create' }).click()
    await page.getByText('New blog new title 1 by author new author 1')
    await expect(page.getByText('new title 1 - new author 1 view')).toBeVisible()
    await page.getByRole('button', { name: 'view' }).first().click()
    await page.getByRole('button', { name: 'view' }).first().click()
    await expect(page.getByText('Yaroslav Romashkoremove blog')).not.toBeVisible()
    await expect(page.getByText('Ruslan Ivanovremove blog')).toBeVisible()
  })

  test('blogs are in the descending order by number of likes', async ({ page }) => {
    await page.getByTestId('username').fill('yaroslav')
    await page.getByTestId('password').fill('123')
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.locator('#title').fill('new title')
    await page.locator('#author').fill('new author')
    await page.locator('#url').fill('new url')
    await page.getByRole('button', { name: 'create' }).click()
    await page.getByText('New blog new title by author new author')
    await expect(page.getByText('new title - new author view')).toBeVisible()
    await page.getByRole('button', { name: 'logout' }).click()

    await page.getByTestId('username').fill('ruslan')
    await page.getByTestId('password').fill('123')
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.locator('#title').fill('new title 1')
    await page.locator('#author').fill('new author 1')
    await page.locator('#url').fill('new url 1')
    await page.getByRole('button', { name: 'create' }).click()
    await page.getByText('New blog new title 1 by author new author 1')
    await expect(page.getByText('new title 1 - new author 1 view')).toBeVisible()
    await page.getByRole('button', { name: 'view' }).first().click()
    await page.getByRole('button', { name: 'view' }).first().click()
    await page.getByRole('button', { name: 'like' }).nth(1).click()
    const pageText = await page.locator('body').textContent()
    const likes1Index = pageText.indexOf('likes 1')
    const likes0Index = pageText.indexOf('likes 0')
    expect(likes1Index).toBeLessThan(likes0Index)
  })
})