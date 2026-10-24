'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import CanvasPdfReader from '@/components/pdf-viewer/CanvasPdfReader';
import { Loader2, AlertCircle, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
export default function ReaderPage() {
    const params = useParams();
    const guideId = params?.guideId;
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [guide, setGuide] = useState(null);
    const [access, setAccess] = useState({
        isPurchased: false,
        isAdmin: false,
        lastReadPage: 1,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!authLoading && !user) {
            router.push(`/login?redirect=/dashboard/reader/${guideId}`);
            return;
        }
        async function verifyAndLoadGuide() {
            if (!guideId || !user)
                return;
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/guides/${guideId}`);
                const data = await res.json();
                if (!data.success || !data.guide) {
                    throw new Error('Guide document not found');
                }
                setGuide(data.guide);
                if (data.access) {
                    setAccess(data.access);
                }
                if (!data.access?.isPurchased && !data.access?.isAdmin) {
                    throw new Error('You do not own this guide. Please purchase it to read online.');
                }
            }
            catch (err) {
                console.error('Error loading reader:', err);
                setError(err.message || 'Error accessing course reader');
            }
            finally {
                setLoading(false);
            }
        }
        if (user) {
            verifyAndLoadGuide();
        }
    }, [guideId, user, authLoading, router]);
    if (authLoading || loading) {
        return (<div className="h-screen w-screen flex flex-col items-center justify-center bg-white text-slate-900">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mb-4"/>
        <p className="text-base font-semibold text-slate-800">Authenticating DRM reader session...</p>
        <p className="text-xs text-slate-500 mt-1">Generating personalized canvas watermark</p>
      </div>);
    }
    if (error || !guide || !user) {
        return (<div className="h-screen w-screen flex items-center justify-center bg-[#F8FAFC] p-4 text-slate-900">
        <div className="max-w-md rounded-2xl bg-white border border-slate-200 p-8 text-center space-y-4 shadow-xl">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto"/>
          <h2 className="text-lg font-bold text-slate-900">Access Denied</h2>
          <p className="text-xs text-slate-600">{error || 'User session required'}</p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href="/dashboard" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold">
              <ArrowLeft className="h-4 w-4"/> Back to Library
            </Link>
            <Link href={`/checkout?guideId=${guideId}`} className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold">
              <ShoppingBag className="h-4 w-4"/> Purchase Guide
            </Link>
          </div>
        </div>
      </div>);
    }
    return (<CanvasPdfReader guideId={guide.id || guide._id} guideTitle={guide.title} userEmail={user.email} userName={user.name} userId={user.id} initialPage={access.lastReadPage || 1} isPreview={false} guidePrice={guide.price}/>);
}
