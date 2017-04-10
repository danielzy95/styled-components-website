import React from 'react'
import DocsLayout from '../../../components/DocsLayout'
import LiveEdit from '../../../components/LiveEdit'

const sample = (`
// The Button from the last section without the interpolations
const Button = styled.button\`
  background: white;
  color: palevioletred;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
\`;

// We are passing the Button into the styled function
const TomatoButton = styled(Button)\`
  color: tomato;
  border-color: tomato;
\`;

render(
  <div>
    <Button>Normal Button</Button>
    <TomatoButton>Tomato Button</TomatoButton>
  </div>
);
`).trim()

const OverridingComponentStyles = ({ url }) => (
  <DocsLayout url={url}>
    <p>
      Instead of styling an element, you can override styles of existing styled components
      as well. In this case, the new styles are used along the old ones,
      while both components stay independent from each other.
    </p>

    <p>
      Here we use the button from the last section and create a special one, overriding
      some colour-related styling.
    </p>

    <LiveEdit
      code={sample}
      noInline
    />

    <p>
      We can see that the new TomatoButton still resembles Button, while we have only
      added two new rules.
    </p>
  </DocsLayout>
)

export default OverridingComponentStyles