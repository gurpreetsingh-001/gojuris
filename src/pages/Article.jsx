import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ApiService from '../services/apiService';

const Article = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [blogPosts, setBlogPosts] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [pdfUrl, setPdfUrl] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState(null);
    const handleOpenPdf = (post) => {
        const url = `https://legaleagleweb.com/CompleteActPDF/${post}.pdf`;   // your final URL
        setTitle(post);
        setPdfUrl(url);
        setShowModal(true);
    };
    useEffect(() => {
        document.body.style.paddingTop = '0';

        return () => {
            document.body.style.paddingTop = '';
        };
    }, []);

    useEffect(() => {
        async function fetchData() {

            const apiResponse = await ApiService.getArticle(id);
            setBlogPosts(apiResponse || []);

            setIsLoading(false);
        }
        fetchData();
    }, []);
    const formatDate = (dateStr) => {
        if (dateStr) {
            try {
                if (dateStr.length === 8) {
                    const year = dateStr.substring(0, 4);
                    const month = dateStr.substring(4, 6);
                    const day = dateStr.substring(6, 8);
                    return `${day}/${month}/${year}`;
                }
                return dateStr;
            } catch {
                return dateStr;
            }
        }
        return 'Date not available';
    };
    
   
    if (isLoading) {
        return (
            <div className="gojuris-layout">
                <Sidebar />

                <div className="gojuris-main">
                    <Navbar />
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
                        <div className="text-center">
                            <i className="bx bx-loader bx-spin" style={{ fontSize: '2rem', color: 'var(--gj-primary)' }}></i>
                            <p className="mt-2">Loading Article...</p>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
    return (
        <div className="gojuris-layout">
            <Sidebar />

            <div className="gojuris-main">
                <Navbar />

                <div className="lawpoint-container" style={{ padding: '2rem' }}>
                    <div className="lawpoint-content">
                        
                        <section aria-label="Articles"> <ul className="article-list">
                        {blogPosts.map((item, index) => (
                            <div key={item.id}>
                                <article className="article-card">
                                        <div className="text-center">
                                            <h4>{item.title}</h4>
                                             <img src={'https://legaleagleweb.com/articalsimage/' + item.image} alt={item.title} className="article-img" loading="lazy" />
                                            <p className="excerpt">{item.excerpt}</p>
                                            <p className="meta"><strong>By:</strong> {item.author}</p>
                                            <p className="meta"><strong>Published on:</strong> {item.postDate}</p>
                                            <p className="meta"><strong>Subject:</strong> {item.subject}</p>
                                        </div>

                                        <div dangerouslySetInnerHTML={{ __html: item.description }} />
                                   
                                </article>
                            </div>
                        ))}
                        </ul>
                        </section>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-xl" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{title}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>

                            <div className="modal-body" style={{ height: "80vh" }}>
                                <iframe
                                    src={pdfUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: "none" }}
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <style>{`
        .article-img {
  height: 200px;
  width: 150px;
  object-fit: cover;
}

      `}</style>
        </div>

    )
}

export default Article;