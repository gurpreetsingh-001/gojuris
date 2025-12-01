import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ApiService from '../services/apiService';

const LatestLawPoints = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [blogPosts, setBlogPosts] = useState([]);
    useEffect(() => {
        document.body.style.paddingTop = '0';

        return () => {
            document.body.style.paddingTop = '';
        };
    }, []);

    useEffect(() => {
        async function fetchData() {
            const payload = {
                requests: [{
                    mainkeys: ['ALL'],
                }],
                sortBy: 'year',
                sortOrder: 'desc',
                page: 1,
                pageSize: 100,
                inst: '',
                prompt: "Advance",
            };
            const apiResponse = await ApiService.getLawPoints(
                payload
            );
            setBlogPosts(apiResponse.hits || []);
            const searchResults = apiResponse.hits || [];
            const totalCount = apiResponse.total || 0;
            const courtsList = apiResponse.courtsList || [];
            const yearList = apiResponse.yearList || [];
            const resultsData = {
                results: searchResults,
                totalCount: totalCount,
                query: ``.trim(),
                searchType: 'Law Point',
                timestamp: new Date().toISOString(),
                // ✅ IMPORTANT: Include API filter data
                courtsList: courtsList,
                yearList: yearList,
                searchData: {
                    mainkeys: ['ALL'],
                }
            };

            console.log('💾 Storing citation results with API filter data:', resultsData);
            localStorage.setItem('searchResults', JSON.stringify(resultsData));
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
    const handleJudgementClick = (judgement) => {
        debugger;
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
                            <p className="mt-2">Loading Law points...</p>
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
                        <h2 className="lawpoint-main-title">Latest Law-Points</h2>
                        {blogPosts.map((post, index) => (
                            <div key={index} className="">
                                <article className="card card-hover border-0 shadow-lg h-100 m-2">

                                    <div className="card-body p-3">
                                        <h3 className="h5 mb-2" onClick={(e) => {
                                            e.preventDefault();
                                            handleJudgementClick(post)
                                        }
                                        }>
                                            <a href="#" className="text-decoration-none stretched-link" style={{ color: "#337ab7" }} dangerouslySetInnerHTML={{ __html: post.lawPoint || '' }}>

                                            </a>
                                        </h3>
                                        <p className="text mb-1">[{post.appellant} Vs. {post.respondent}] <span style={{ color: "green" }}>Date of Decision : {formatDate(post.date)} </span></p>
                                        <small className="text" style={{ color: "red" }}>{post.court}</small>
                                    </div>
                                </article>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default LatestLawPoints;