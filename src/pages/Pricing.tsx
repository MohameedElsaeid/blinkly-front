import React, {useState, useEffect} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BillingToggle from "@/components/pricing/BillingToggle";
import PricingView from "@/components/pricing/PricingView";
import PricingTable from "@/components/pricing/PricingTable";
import FAQ from "@/components/pricing/FAQ";
import {featureCategories, plans} from "@/data/pricingData";
import {generateStructuredData, SEO} from "@/utils/seo";
import {useMetaPixel} from "@/hooks";

const Pricing = () => {
    const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
    const {trackEvent} = useMetaPixel();

    // Track page view
    useEffect(() => {
        trackEvent({
            event: 'ViewContent',
            customData: {
                content_name: 'pricing_page',
                content_category: 'pricing',
                content_type: 'pricing_plans'
            }
        });
    }, [trackEvent]);

    // Generate FAQ data for schema markup
    const faqItems = [
        {
            question: "Can I change my plan later?",
            answer: "Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes will be effective in your next billing cycle."
        },
        {
            question: "Do you offer discounts for nonprofits or educational institutions?",
            answer: "Yes, we offer special pricing for nonprofit organizations, educational institutions, and open-source projects. Please contact our sales team for more information."
        },
        {
            question: "How do the monthly link limits work?",
            answer: "The monthly link limit refers to the number of new links you can create during your billing cycle. Links from previous months don't count against your current month's limit."
        },
        {
            question: "Is there a free trial?",
            answer: "Yes, all paid plans come with a 14-day free trial, no credit card required. You can test all features before committing to a subscription."
        }
    ];

    const handleBillingPeriodChange = (period: "monthly" | "yearly") => {
        setBillingPeriod(period);
        
        // Track billing period selection with Meta Pixel
        trackEvent({
            event: 'CustomizeProduct',
            customData: {
                content_name: 'billing_period_selection',
                content_category: 'pricing',
                billing_period: period,
                value: period === 'yearly' ? 20 : 0 // Default discount value
            }
        });
    };

    const handleViewPlans = (viewType: string) => {
        // Track plan view type selection
        trackEvent({
            event: 'ViewContent',
            customData: {
                content_name: 'pricing_plans_view',
                content_type: viewType,
                content_category: 'pricing',
                view_mode: viewType
            }
        });
    };

    const handleFaqItemClick = (question: string) => {
        // Track FAQ interactions
        trackEvent({
            event: 'Search',
            customData: {
                content_name: 'pricing_faq',
                content_category: 'pricing',
                search_string: question
            }
        });
    };

    return (
        <div className="min-h-screen flex flex-col">
            <SEO
                title="Pricing - Link Management Platform"
                description="Explore Blinkly's flexible pricing plans - from free personal use to enterprise solutions. Find the perfect plan for your link management needs."
                url="https://blinkly.app/pricing"
                structuredData={{
                    ...generateStructuredData.product(),
                    ...generateStructuredData.faq(faqItems)
                }}
            />

            <Navbar/>

            <main className="flex-grow">
                <div className="bg-gradient-to-b from-white to-alchemy-purple-light/10 py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                                Pricing Plans
                            </h1>
                            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                                Simple, transparent pricing for everyone. Scale as you grow.
                            </p>

                            <BillingToggle
                                billingPeriod={billingPeriod}
                                onChange={handleBillingPeriodChange}
                            />
                        </div>

                        <Tabs defaultValue="cards" className="w-full" onValueChange={handleViewPlans}>
                            <div className="flex justify-center mb-8">
                                <TabsList>
                                    <TabsTrigger value="cards">Plan Cards</TabsTrigger>
                                    <TabsTrigger value="table">Comparison Table</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="cards" className="mt-0">
                                <PricingView plans={plans} billingPeriod={billingPeriod}/>
                            </TabsContent>

                            <TabsContent value="table" className="mt-0">
                                <PricingTable
                                    plans={plans}
                                    featureCategories={featureCategories}
                                    billingPeriod={billingPeriod}
                                />
                            </TabsContent>
                        </Tabs>

                        <div className="mt-16 text-center" onClick={(e) => {
                            // Track FAQ interaction
                            const target = e.target as HTMLElement;
                            const question = target.closest('[data-faq-question]')?.getAttribute('data-faq-question');
                            if (question) {
                                handleFaqItemClick(question);
                            }
                        }}>
                            <FAQ />
                        </div>
                    </div>
                </div>
            </main>

            <Footer/>
        </div>
    );
};

export default Pricing;
