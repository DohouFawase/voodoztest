'use client';

import { fetchShelves } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { Shelf } from '@/lib/type';
import { motion, Variants } from 'framer-motion';
import { BookOpen, User, Heart } from 'lucide-react';

export default function ShelfList() {
  const { data, isPending, error } = useQuery<Shelf[]>({
    queryKey: ['fetchShelves'],
    queryFn: fetchShelves,
  });

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-xl font-medium text-gray-700">Chargement des étagères...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white rounded-2xl shadow-xl"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-red-500" />
          </div>
          <p className="text-xl font-semibold text-red-600 mb-2">Oops! Une erreur s&apos;est produite</p>
          <p className="text-gray-600">{error.message}</p>
        </motion.div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white rounded-2xl shadow-xl"
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-xl font-semibold text-gray-700 mb-2">Aucune étagère trouvée</p>
          <p className="text-gray-500">Revenez plus tard pour découvrir de nouvelles collections</p>
        </motion.div>
      </div>
    );
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Bibliothèques Partagées
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez des collections uniques créées par notre communauté de lecteurs passionnés
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {data.map((shelf) => (
            <motion.div
              key={shelf.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                transition: { type: "spring" as const, stiffness: 300, damping: 10 }
              }}
              whileTap={{ scale: 0.98 }}
              className="group"
            >
              <Link href={`/shelf/${shelf.id}`}>
                <div className="relative overflow-hidden bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 h-full border border-gray-100">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Title */}
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
                        {shelf.title}
                      </h2>
                      
                      {/* Decorative line */}
                      <div className="w-12 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full group-hover:w-20 transition-all duration-300" />
                    </div>

                    {/* User info */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative">
                        <Image
                          src={shelf.user.image}
                          alt={shelf.user.name}
                          width={50}
                          height={50}
                          className="rounded-full ring-2 ring-white shadow-lg group-hover:ring-indigo-200 transition-all duration-300"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
                          {shelf.user.name}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          Créateur
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>Collection</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Heart className="w-4 h-4 text-red-400" />
                        <span>Explorer</span>
                      </div>
                    </div>

                    {/* Hover arrow */}
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}