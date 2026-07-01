import React from 'react';
import { motion } from 'motion/react';
import { Shield, FileText, LifeBuoy, Mail, MessageSquare } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="prose prose-invert max-w-none">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="text-blue-500 w-8 h-8" />
        <h1 className="text-4xl font-bold text-white m-0">Privacy Policy</h1>
      </div>
      <div className="space-y-6 text-slate-300">
        <p className="text-lg">Last updated: July 1, 2026</p>
        <section>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you create an account, make a purchase, or communicate with us. This may include your name, email address, payment information, and shipping address.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about products, services, offers, and events.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Data Security</h2>
          <p>We implement appropriate technical and organizational security measures to protect your personal information against accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access.</p>
        </section>
      </div>
    </motion.div>
  );
}

export function TermsOfService() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="prose prose-invert max-w-none">
      <div className="flex items-center gap-3 mb-8">
        <FileText className="text-blue-500 w-8 h-8" />
        <h1 className="text-4xl font-bold text-white m-0">Terms of Service</h1>
      </div>
      <div className="space-y-6 text-slate-300">
        <p className="text-lg">Last updated: July 1, 2026</p>
        <section>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Agreement to Terms</h2>
          <p>By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Intellectual Property</h2>
          <p>The service and its original content, features, and functionality are and will remain the exclusive property of our company and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Purchases and Payment</h2>
          <p>We accept various forms of payment. By providing a payment method, you represent and warrant that you are authorized to use the designated payment method and that you authorize us to charge your payment method for the total amount of your purchase.</p>
        </section>
      </div>
    </motion.div>
  );
}

export function Support() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-3 mb-8">
        <LifeBuoy className="text-blue-500 w-8 h-8" />
        <h1 className="text-4xl font-bold text-white m-0">Help & Support</h1>
      </div>
      
      <div className="grid gap-8 mb-12">
        <div className="bg-[#161616] border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-colors">
          <Mail className="text-blue-400 w-8 h-8 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Email Support</h3>
          <p className="text-slate-400 mb-4">Our team typically replies within 24 hours.</p>
          <a href="mailto:aahanamagar267@gmail.com" className="text-blue-400 hover:text-blue-300 font-medium">aahanamagar267@gmail.com</a>
        </div>
      </div>
      
      <div className="bg-[#161616] border border-white/5 p-8 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6 text-slate-300">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">What is your return policy?</h3>
            <p className="text-slate-400">We offer a 30-day return policy for all unused items in their original packaging.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">How do I track my order?</h3>
            <p className="text-slate-400">Once your order ships, you will receive a confirmation email with a tracking link.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Do you ship internationally?</h3>
            <p className="text-slate-400">Yes, we ship to over 100 countries worldwide. Shipping costs will apply and will be added at checkout.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
