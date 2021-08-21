import ContentLoader from 'react-content-loader'

export default function StatusLoader(props) {
  return (
    <ContentLoader 
      speed={2}
      width={300}
      height={130}
      viewBox="0 0 525 225"
      backgroundColor="#2b2b2b"
      foregroundColor="#424242"
      {...props}
    >
      <circle cx="85" cy="85" r="60" /> 
      <rect x="25" y="160" rx="3" ry="3" width="250" height="50" />
    </ContentLoader>
  )
}