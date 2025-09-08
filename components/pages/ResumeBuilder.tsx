
import React, { useState, useEffect, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import { AddIcon, DownloadIcon, SaveIcon, TrashIcon, TemplateIcon, ColorPaletteIcon, FontSizeIcon } from '../icons/PageIcons';

// --- TYPE DEFINITIONS ---
interface SectionItem { id: number; [key: string]: any; }
interface CustomSection { id: number; title: string; items: SectionItem[]; }
interface ResumeData {
    personalDetails: { name: string; email: string; phone: string; linkedin: string; summary: string; };
    experiences: SectionItem[];
    educations: SectionItem[];
    projects: SectionItem[];
    skills: string;
    customSections: CustomSection[];
}
interface ResumeVersion { id: number; name: string; data: ResumeData; }

type ArraySectionKey = 'experiences' | 'educations' | 'projects';

// --- INITIAL DATA ---
const initialData: ResumeData = {
    personalDetails: { name: 'Priya Sharma', email: 'priya.sharma@example.com', phone: '+91 98765 43210', linkedin: 'linkedin.com/in/priya-sharma', summary: 'Passionate B.Tech student with a focus on AI/ML. Eager to apply my skills in a challenging internship role.' },
    experiences: [{ id: 1, title: 'Summer Intern', company: 'Tech Solutions Inc.', duration: 'May 2023 - Aug 2023', description: '- Developed a sentiment analysis model for customer feedback.\n- Improved response accuracy by 15%.' }],
    educations: [{ id: 1, degree: 'B.Tech in Computer Science', school: 'RGUKT', duration: '2021 - 2025' }],
    projects: [{ id: 1, name: 'AI Chatbot for Education', description: 'Built a chatbot using TensorFlow to answer student queries on various subjects.' }],
    skills: 'Python, Machine Learning, Data Analysis, React.js, Node.js, TensorFlow, SQL, Git',
    customSections: []
};

// --- HELPER COMPONENTS ---
const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; placeholder?: string; isTextArea?: boolean }> = ({ label, value, onChange, placeholder, isTextArea = false }) => (
    <div>
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">{label}</label>
        {isTextArea ? (
             <textarea value={value} onChange={onChange} placeholder={placeholder} rows={3} className="input-field text-sm" />
        ) : (
             <input type="text" value={value} onChange={onChange} placeholder={placeholder} className="input-field text-sm" />
        )}
    </div>
);

const ResumeBuilder: React.FC = () => {
    // --- STATE MANAGEMENT ---
    const [versions, setVersions] = useState<ResumeVersion[]>([{ id: Date.now(), name: 'My First Resume', data: initialData }]);
    const [activeVersionId, setActiveVersionId] = useState<number>(versions[0].id);
    const [customization, setCustomization] = useState({ template: 'classic', color: '#6D28D9', fontSize: 10 });
    const [activeResume, setActiveResume] = useState<ResumeData>(versions[0].data);

    useEffect(() => {
        const activeVer = versions.find(v => v.id === activeVersionId);
        if (activeVer) {
            setActiveResume(activeVer.data);
        }
    }, [activeVersionId, versions]);
    
    const updateActiveResume = useCallback((updater: (prev: ResumeData) => ResumeData) => {
        const updatedResume = updater(activeResume);
        setActiveResume(updatedResume);
        setVersions(prevVersions =>
            prevVersions.map(v => (v.id === activeVersionId ? { ...v, data: updatedResume } : v))
        );
    }, [activeResume, activeVersionId]);

    // --- HANDLERS ---
    const handleAddNewVersion = () => {
        const newVersionName = prompt("Enter new version name:", `Resume Version ${versions.length + 1}`);
        if (newVersionName) {
            const newVersion = { id: Date.now(), name: newVersionName, data: initialData };
            setVersions([...versions, newVersion]);
            setActiveVersionId(newVersion.id);
        }
    };
    
    const handleAddItem = (section: ArraySectionKey | number) => {
        if (typeof section === 'string') {
            updateActiveResume(prev => ({
                ...prev,
                [section]: [...prev[section], { id: Date.now(), title: '', company: '', duration: '', description: '', degree: '', school: '', name: '' }]
            }));
        } else {
             updateActiveResume(prev => ({
                ...prev,
                customSections: prev.customSections.map(cs => cs.id === section ? {...cs, items: [...cs.items, {id: Date.now(), name: '', description: ''}]} : cs)
            }));
        }
    };

    const handleRemoveItem = (section: ArraySectionKey | number, id: number) => {
        if (typeof section === 'string') {
            updateActiveResume(prev => ({
                ...prev,
                [section]: prev[section].filter((item: SectionItem) => item.id !== id)
            }));
        } else {
            updateActiveResume(prev => ({
                ...prev,
                customSections: prev.customSections.map(cs => cs.id === section ? {...cs, items: cs.items.filter(item => item.id !== id)} : cs)
            }));
        }
    };
    
    const handleItemChange = (section: ArraySectionKey | number, id: number, field: string, value: string) => {
       if (typeof section === 'string') {
            updateActiveResume(prev => ({
                ...prev,
                [section]: prev[section].map((item: SectionItem) => item.id === id ? { ...item, [field]: value } : item)
            }));
       } else {
            updateActiveResume(prev => ({
                ...prev,
                customSections: prev.customSections.map(cs => cs.id === section ? {...cs, items: cs.items.map(item => item.id === id ? {...item, [field]: value} : item)} : cs)
            }));
       }
    };

    const handleAddCustomSection = () => {
        const title = prompt("Enter new section title (e.g., Awards):");
        if (title) {
            updateActiveResume(prev => ({
                ...prev,
                customSections: [...prev.customSections, { id: Date.now(), title, items: [{ id: Date.now(), name: '', description: '' }] }]
            }));
        }
    };

    const handleDownload = () => {
        const doc = new jsPDF('p', 'pt', 'a4');
        const { personalDetails, experiences, educations, projects, skills, customSections } = activeResume;
        const { color, fontSize } = customization;
        const margin = 40;
        let y = margin;

        // Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(color);
        doc.text(personalDetails.name, margin, y);
        y += 25;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(fontSize);
        doc.setTextColor(0, 0, 0);
        doc.text(`${personalDetails.email} | ${personalDetails.phone} | ${personalDetails.linkedin}`, margin, y);
        y += 25;

        // Helper to render a section
        const renderSection = (title: string, items: any[], itemRenderer: (item: any, y: number) => number) => {
            if (items.length === 0) return y;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(fontSize + 2);
            doc.setTextColor(color);
            doc.text(title.toUpperCase(), margin, y);
            doc.setDrawColor(color);
            doc.line(margin, y + 5, 555, y + 5);
            y += 25;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(fontSize);
            doc.setTextColor(0, 0, 0);
            items.forEach(item => { y = itemRenderer(item, y); });
            return y;
        };

        // Summary
        y = renderSection('Professional Summary', [{ summary: personalDetails.summary }], (item, currentY) => {
            const lines = doc.splitTextToSize(item.summary, 500);
            doc.text(lines, margin, currentY);
            return currentY + lines.length * (fontSize + 2) + 10;
        });

        // Experience
        y = renderSection('Experience', experiences, (item, currentY) => {
            doc.setFont('helvetica', 'bold');
            doc.text(item.title, margin, currentY);
            doc.setFont('helvetica', 'normal');
            doc.text(`${item.company} | ${item.duration}`, margin, currentY + (fontSize + 2));
            const descLines = doc.splitTextToSize(item.description, 480);
            doc.text(descLines, margin + 10, currentY + (fontSize + 2) * 2);
            return currentY + ((fontSize + 2) * 2) + (descLines.length * (fontSize + 2)) + 10;
        });
        
        // Projects
        y = renderSection('Projects', projects, (item, currentY) => {
            doc.setFont('helvetica', 'bold');
            doc.text(item.name, margin, currentY);
            const descLines = doc.splitTextToSize(item.description, 480);
            doc.setFont('helvetica', 'normal');
            doc.text(descLines, margin + 10, currentY + (fontSize + 2));
            return currentY + (fontSize + 2) + (descLines.length * (fontSize + 2)) + 10;
        });
        
        // Custom Sections
        customSections.forEach(section => {
            y = renderSection(section.title, section.items, (item, currentY) => {
                 doc.setFont('helvetica', 'bold');
                 doc.text(item.name, margin, currentY);
                 const descLines = doc.splitTextToSize(item.description, 480);
                 doc.setFont('helvetica', 'normal');
                 doc.text(descLines, margin + 10, currentY + (fontSize + 2));
                 return currentY + (fontSize + 2) + (descLines.length * (fontSize + 2)) + 10;
            });
        });

        // Education
        y = renderSection('Education', educations, (item, currentY) => {
            doc.setFont('helvetica', 'bold');
            doc.text(item.degree, margin, currentY);
            doc.setFont('helvetica', 'normal');
            doc.text(`${item.school} | ${item.duration}`, margin, currentY + (fontSize + 2));
            return currentY + (fontSize + 2) * 2 + 10;
        });
        
        // Skills
        y = renderSection('Skills', [{ skills: skills }], (item, currentY) => {
             const lines = doc.splitTextToSize(item.skills, 500);
            doc.text(lines, margin, currentY);
            return currentY + lines.length * (fontSize + 2) + 10;
        });
        
        doc.save(`${personalDetails.name.replace(' ', '_')}_Resume.pdf`);
    };

    return (
        <main className="flex-grow w-full bg-gray-50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 shadow-sm p-3 flex justify-between items-center sticky top-16 z-30">
                <div>
                     <label htmlFor="version-select" className="text-sm font-semibold mr-2">Resume Version:</label>
                     <select id="version-select" value={activeVersionId} onChange={e => setActiveVersionId(Number(e.target.value))} className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500">
                        {versions.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                    <button onClick={handleAddNewVersion} className="ml-2 text-purple-600 dark:text-purple-400 font-semibold text-sm hover:underline">+ New</button>
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => alert('Version Saved!')} className="btn btn-primary flex items-center"><SaveIcon /><span>Save Version</span></button>
                    <button onClick={handleDownload} className="btn btn-secondary flex items-center"><DownloadIcon /><span>Download PDF</span></button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Form Section */}
                <div className="p-6 h-[calc(100vh-140px)] overflow-y-auto">
                    <div className="space-y-6">
                        {/* Personal Details Form */}
                        <div className="card p-4"><h3 className="font-bold text-lg mb-2">Personal Details</h3>
                            <InputField label="Full Name" value={activeResume.personalDetails.name} onChange={e => updateActiveResume(p => ({ ...p, personalDetails: { ...p.personalDetails, name: e.target.value } }))} />
                            <InputField label="Email" value={activeResume.personalDetails.email} onChange={e => updateActiveResume(p => ({ ...p, personalDetails: { ...p.personalDetails, email: e.target.value } }))} />
                            <InputField label="Phone" value={activeResume.personalDetails.phone} onChange={e => updateActiveResume(p => ({ ...p, personalDetails: { ...p.personalDetails, phone: e.target.value } }))} />
                            <InputField label="LinkedIn" value={activeResume.personalDetails.linkedin} onChange={e => updateActiveResume(p => ({ ...p, personalDetails: { ...p.personalDetails, linkedin: e.target.value } }))} />
                            <InputField label="Summary" value={activeResume.personalDetails.summary} onChange={e => updateActiveResume(p => ({ ...p, personalDetails: { ...p.personalDetails, summary: e.target.value } }))} isTextArea />
                        </div>
                        {/* Dynamic Sections */}
                        {(['experiences', 'projects', 'educations'] as ArraySectionKey[]).map(sectionKey => (
                            <div key={sectionKey} className="card p-4"><h3 className="font-bold text-lg mb-2 capitalize">{sectionKey}</h3>
                                {(activeResume[sectionKey] as SectionItem[]).map((item) => (
                                     <div key={item.id} className="p-3 mb-2 border dark:border-gray-700 rounded-lg space-y-2 relative">
                                        <button onClick={() => handleRemoveItem(sectionKey, item.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><TrashIcon /></button>
                                        {Object.keys(item).filter(k => k !== 'id').map(field => (
                                            <InputField key={field} label={field.charAt(0).toUpperCase() + field.slice(1)} value={item[field]} onChange={e => handleItemChange(sectionKey, item.id, field, e.target.value)} isTextArea={field === 'description'}/>
                                        ))}
                                    </div>
                                ))}
                                <button onClick={() => handleAddItem(sectionKey)} className="text-purple-600 dark:text-purple-400 font-semibold text-sm flex items-center mt-2"><AddIcon /> Add {sectionKey.slice(0, -1)}</button>
                            </div>
                        ))}
                        {/* Custom Sections Form */}
                         <div className="card p-4">
                            {activeResume.customSections.map(section => (
                                <div key={section.id}><h3 className="font-bold text-lg mb-2 capitalize">{section.title}</h3>
                                {section.items.map(item => (
                                    <div key={item.id} className="p-3 mb-2 border dark:border-gray-700 rounded-lg space-y-2 relative">
                                        <button onClick={() => handleRemoveItem(section.id, item.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><TrashIcon /></button>
                                        {Object.keys(item).filter(k=>k!=='id').map(field => (
                                            <InputField key={field} label={field.charAt(0).toUpperCase() + field.slice(1)} value={item[field]} onChange={e => handleItemChange(section.id, item.id, field, e.target.value)} isTextArea={field === 'description'}/>
                                        ))}
                                    </div>
                                ))}
                                <button onClick={() => handleAddItem(section.id)} className="text-purple-600 dark:text-purple-400 font-semibold text-sm flex items-center mt-2"><AddIcon /> Add Item</button>
                                </div>
                            ))}
                            <button onClick={handleAddCustomSection} className="text-purple-600 dark:text-purple-400 font-semibold text-sm flex items-center mt-4"><AddIcon /> Add Custom Section</button>
                        </div>
                        {/* Skills Form */}
                        <div className="card p-4"><h3 className="font-bold text-lg mb-2">Skills</h3><InputField label="Skills (comma separated)" value={activeResume.skills} onChange={e => updateActiveResume(p => ({...p, skills: e.target.value}))} isTextArea /></div>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="bg-gray-200 dark:bg-gray-900 p-4 h-[calc(100vh-140px)] overflow-hidden">
                     {/* Customization Toolbar */}
                     <div className="flex items-center space-x-4 p-2 mb-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-semibold">Customize:</span>
                        <button className="flex items-center text-sm space-x-1"><TemplateIcon /><span>Template</span></button>
                        <div className="flex items-center text-sm space-x-1"><ColorPaletteIcon /><input type="color" value={customization.color} onChange={e => setCustomization({...customization, color: e.target.value})} className="w-6 h-6" /></div>
                        <button onClick={() => setCustomization({...customization, fontSize: customization.fontSize - 1})} className="flex items-center text-sm space-x-1"><FontSizeIcon /><span>-</span></button>
                        <span>{customization.fontSize}pt</span>
                        <button onClick={() => setCustomization({...customization, fontSize: customization.fontSize + 1})} className="flex items-center text-sm space-x-1"><FontSizeIcon /><span>+</span></button>
                     </div>
                     <div className="w-full h-full overflow-y-auto bg-white p-8 shadow-lg font-sans text-gray-800" style={{ fontSize: `${customization.fontSize}pt` }}>
                        {/* Live Preview Rendered Here */}
                        <h1 className="text-3xl font-bold border-b pb-2" style={{ color: customization.color, borderColor: customization.color }}>{activeResume.personalDetails.name}</h1>
                        <p className="text-sm pt-2">{activeResume.personalDetails.email} | {activeResume.personalDetails.phone} | {activeResume.personalDetails.linkedin}</p>
                        
                        <h2 className="text-md font-bold mt-6 border-b pb-1" style={{ color: customization.color, borderColor: customization.color }}>PROFESSIONAL SUMMARY</h2>
                        <p className="text-sm mt-2 whitespace-pre-wrap">{activeResume.personalDetails.summary}</p>
                        
                        <h2 className="text-md font-bold mt-6 border-b pb-1" style={{ color: customization.color, borderColor: customization.color }}>EXPERIENCE</h2>
                        {activeResume.experiences.map((exp: any) => <div key={exp.id} className="mt-2"><h3 className="text-sm font-semibold">{exp.title}</h3><p className="text-xs italic">{exp.company} | {exp.duration}</p><div className="text-sm mt-1 whitespace-pre-wrap">{exp.description}</div></div>)}

                        <h2 className="text-md font-bold mt-6 border-b pb-1" style={{ color: customization.color, borderColor: customization.color }}>PROJECTS</h2>
                        {activeResume.projects.map((proj: any) => <div key={proj.id} className="mt-2"><h3 className="text-sm font-semibold">{proj.name}</h3><p className="text-sm mt-1 whitespace-pre-wrap">{proj.description}</p></div>)}
                        
                        {activeResume.customSections.map(section => (
                             <div key={section.id}><h2 className="text-md font-bold mt-6 border-b pb-1" style={{ color: customization.color, borderColor: customization.color }}>{section.title.toUpperCase()}</h2>
                             {section.items.map((item: any) => <div key={item.id} className="mt-2"><h3 className="text-sm font-semibold">{item.name}</h3><p className="text-sm mt-1 whitespace-pre-wrap">{item.description}</p></div>)}
                             </div>
                        ))}

                        <h2 className="text-md font-bold mt-6 border-b pb-1" style={{ color: customization.color, borderColor: customization.color }}>EDUCATION</h2>
                        {activeResume.educations.map((edu: any) => <div key={edu.id} className="mt-2"><h3 className="text-sm font-semibold">{edu.degree}</h3><p className="text-xs">{edu.school} | {edu.duration}</p></div>)}

                        <h2 className="text-md font-bold mt-6 border-b pb-1" style={{ color: customization.color, borderColor: customization.color }}>SKILLS</h2>
                        <p className="text-sm mt-2">{activeResume.skills}</p>
                     </div>
                </div>
            </div>
          </div>
        </main>
    );
};

export default ResumeBuilder;