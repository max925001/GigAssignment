import React from 'react';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden selection:bg-blue-500/30 flex flex-col">
            {/* Dynamic Background Elements */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/5 rounded-full blur-[100px]" />
            </div>

            <Navbar />
            <main className="flex-grow pt-20 pb-24 md:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full transition-all duration-300">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {children}
                </div>
            </main>
            <Footer />
            <MobileNav />
        </div>
    );
};

export default MainLayout;
