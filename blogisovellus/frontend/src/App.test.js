import App from './App'
import React from 'react'
import { render, waitForElement, cleanup } from '@testing-library/react'
jest.mock('./services/blogs')

afterEach(cleanup)


describe('<App />', () => {

  test('does not render blogs if no user logged in', async () => {
    const component = render(
      <App />
    )
    component.debug()
    component.rerender(<App />)
    await waitForElement(
      () => {
        component.getByText('Kirjaudu sisään')
      }
    )
    const login = component.container.getByText('Kirjaudu sisään')
    expect(login).toBeDefined()
  })
})


