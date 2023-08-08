import { useState } from "react";
import { useAppSelector } from "../../app/hooks";
import "./Sections.module.css"

const Sections = () => {
    const threats = useAppSelector((state) => state.user.threats);



    // Add a logging statement to see the threats structure

    const [expandedSection, setExpandedSection] = useState<string | null>(
        threats && threats.length > 0 ? threats[0]._id : null
    );
    
    const handleClick = (id: string) => {
        if (expandedSection === id) {
            setExpandedSection(null);
        } else {
            setExpandedSection(id);
        }
    };

    return (
        <section>
            {threats.map((threat) => (
                <div
                    key={threat._id}
                    id={threat._id}
                    onClick={() => handleClick(threat._id)}
                    aria-expanded={expandedSection === threat._id}
                >
                    {threat.entries.map((entry) => (
                        <p key={entry._id} id={entry._id}>{entry.description}</p>
                    ))}
                </div>
            ))}
        </section>
    );
    
};


export default Sections;