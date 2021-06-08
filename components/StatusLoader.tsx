import ContentLoader from 'react-content-loader'

export default function StatusLoader(props) {
  return (
    <ContentLoader 
      speed={2}
      width={105}
      height={55}
      viewBox="0 0 400 160"
      backgroundColor="#2b2b2b"
      foregroundColor="#424242"
      {...props}
    >
      <circle cx="80" cy="80" r="20" /> 
      <rect x="140" y="40" rx="3" ry="3" width="175" height="74" />
    </ContentLoader>
  )
}