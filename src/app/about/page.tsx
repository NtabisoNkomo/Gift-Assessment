'use client';

import { motion } from 'framer-motion';
import { Heart, Target, Users, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-5xl mx-auto space-y-24">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <h1 className="text-5xl md:text-7xl font-black text-gradient">Our Mission</h1>
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium">
          Empowering individuals to discover their divine purpose and serve their community with clarity and passion.
        </p>
      </motion.div>

      {/* Philosophy Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="inline-flex p-3 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
            <Target className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold">Why We Exist</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
            We believe that every person is uniquely gifted. However, identifying those gifts can be challenging without the right tools. Our platform provides a scientifically-backed, spiritually-grounded assessment to help you find your "sweet spot" in service.
          </p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card aspect-video flex items-center justify-center"
        >
          <Sparkles className="w-20 h-20 text-primary-500/50 float-animation" />
        </motion.div>
      </div>

      {/* Values Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Heart, title: "Compassion", desc: "We are driven by a desire to see every individual thrive in their calling." },
          { icon: Users, title: "Community", desc: "Designed for congregations and groups to grow stronger together." },
          { icon: Sparkles, title: "Excellence", desc: "We provide high-quality analytics and professional reporting tools." },
        ].map((value, i) => (
          <motion.div 
            key={value.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="glass-panel p-8 rounded-3xl space-y-4 hover-scale"
          >
            <value.icon className="w-10 h-10 text-primary-500" />
            <h3 className="text-xl font-bold">{value.title}</h3>
            <p className="text-slate-500 dark:text-slate-400">{value.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
