import * as React from 'react'

export interface IExternalLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  component?: React.ComponentType<React.HTMLAttributes<HTMLAnchorElement>>
}

export const ExternalLink: React.FC<IExternalLinkProps> = (props) => {
  const { component: Component = 'a' } = props
  return <Component {...props} target="_blank" rel="noreferrer" />
}

ExternalLink.defaultProps = {}

export default ExternalLink
