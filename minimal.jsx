// ConvertedComponent.jsx
export default function ConvertedComponent() {
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative', background: '#FFF4F8', overflow: 'hidden' }}>
        <div style={{ width: 1440, paddingTop: 40, paddingBottom: 24, paddingLeft: 64, paddingRight: 64, left: 288, top: 120, position: 'absolute', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ width: 1171, justifyContent: 'flex-start', alignItems: 'center', display: 'flex', gap: 10 }}>
            <div style={{ color: '#2C2C2C', fontSize: 32, fontFamily: 'Poppins', fontWeight: 600, wordWrap: 'break-word' }}>
              Overview
            </div>
          </div>
        </div>
  
        <div style={{ width: 1440, paddingTop: 24, paddingBottom: 32, left: 288, top: 232, position: 'absolute', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 36, display: 'inline-flex' }}>
          <div style={{ width: 1440, paddingLeft: 64, paddingRight: 64, justifyContent: 'flex-start', alignItems: 'center', gap: 51, display: 'inline-flex' }}>
            <div style={{ width: 403, paddingTop: 32, paddingBottom: 32, paddingLeft: 32, paddingRight: 32, background: 'white', boxShadow: '0px 6px 6px rgba(0, 0, 0, 0.25)', borderRadius: 16, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 24, display: 'inline-flex' }}>
              <div style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16, display: 'flex' }}>
                <div style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 12, display: 'flex' }}>
                  <div style={{ alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', gap: 10, display: 'inline-flex' }}>
                    <div style={{ color: '#423D3D', fontSize: 24, fontFamily: 'Poppins', fontWeight: 600, wordWrap: 'break-word' }}>
                      Batch Files Count
                    </div>
                  </div>
                </div>
                <div style={{ color: '#8377F7', fontSize: 16, fontFamily: 'Poppins', fontWeight: 500, wordWrap: 'break-word' }}>
                  The number of batch files processed today
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  