import styled, { css } from 'styled-components'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success'

interface ButtonContainerProps {
  variant: ButtonVariant
}

const buttonVariants = {
  primary: 'blue',
  secondary: 'green',
  danger: 'red',
  success: 'yellow',
}

export const ButtonContainer = styled.button<ButtonContainerProps>`
  width: 100px;
  height: 50px;
  border-radius: 4px;
  border: 0;
  margin: 8px;

  background-color: ${(props) => props.theme['green-500']};
  color: ${(props) => props.theme.white};

  /* ${(props) => {
    return css`
      background-color: ${buttonVariants[props.variant]};
    `
  }} */
`
