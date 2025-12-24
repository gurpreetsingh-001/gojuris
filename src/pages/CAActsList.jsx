import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import LeApiService from '../services/leapiService';

const CAActsList = () => {
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

            const apiResponse = await LeApiService.getCAActList();
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
    const filteredItems = blogPosts.filter(item =>
        item.toLowerCase().includes(searchText.toLowerCase())
    );
    const handleJudgementClick = (judgement) => {
        //  console.log('Judgement clicked:', judgement);
        // Navigate to judgement detail page
        const currentIndex = blogPosts.findIndex(result => result.id === judgement.id);
        const navigationData = {
            currentIndex: currentIndex,
            results: blogPosts.map(result => ({
                keycode: result.id,
                title: '',
                court: '',
                date: ''
            })),
            searchQuery: '',
            totalResults: 100,
            currentPage: 1
        };

        sessionStorage.setItem('judgementNavigation', JSON.stringify(navigationData));
        navigate(`/judgement/${judgement.id}`);
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
                            <p className="mt-2">Loading Law...</p>
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

                <div className="lawpoint-container robotofont" style={{ padding: '2rem' }}>
                    <div className="lawpoint-content">
                        <h2 className="lawpoint-main-title">Central Laws</h2>
                        <div className="search-input-wrapper">
                            <input
                                type="text"
                                style={{
                                    width: "100%",
                                    padding: "10px 14px",
                                    fontSize: "14px",
                                    border: "1px solid #ccc",
                                    borderRadius: "6px",
                                    outline: "none",
                                }}
                                placeholder = "Type Here to Search"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        {filteredItems.map((post, index) => (
                            <div key={index} className="">
                                <article className="card card-hover border-0 shadow-lg h-100 m-2">

                                    <div className="card-body p-3">
                                        <h4 className="h5 mb-2" onClick={(e) => {
                                            e.preventDefault();
                                            handleOpenPdf(post);
                                        }}>
                                            <a href="#" className="text-decoration-none stretched-link" style={{ color: "#337ab7" }}
                                            >
                                                {post}
                                            </a>
                                        </h4>

                                    </div>
                                </article>
                            </div>
                        ))}
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
        </div>

    )
}

export default CAActsList;