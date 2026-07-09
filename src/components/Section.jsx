import '../assets/css/section.css'

function Section({ title, sh_right, children }) {
    return(
        <div className="section">
            <div className="section_head">
                <h2 className="section_title">{title}</h2>
                {sh_right && <div className="section_right">{sh_right}</div>}
            </div>

            <div className="section_body">
                {children}
            </div>
        </div>
    )
}

export default Section;