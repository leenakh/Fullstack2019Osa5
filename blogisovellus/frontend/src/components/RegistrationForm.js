import React from 'react'

const RegistrationForm = ({ handleRegistration, username, name, password }) => {
  return (
    <div className="login-frame">
      <form onSubmit={handleRegistration}>
        <table>
          <tbody>
            <tr>
              <td className="login-cell">Nimi</td><td><input className="login-input" {... name} reset={null} /></td>
            </tr>
            <tr>
              <td className="login-cell">Käyttäjätunnus</td><td><input className="login-input" {... username} reset={null} /></td>
            </tr>
            <tr>
              <td className="login-cell">Salasana</td><td><input className="login-input" {... password} reset={null} /></td>
            </tr>
            <tr>
              <td><button type="submit">Rekisteröidy</button></td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  )
}

export default RegistrationForm