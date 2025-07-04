
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { useBooks } from '@/hooks/useBooks';
import BookCard from '@/components/shared/bookcard';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const BOOKS_PER_PAGE = 12;

export default function Page() {
  const params = useParams();
  const shelfId = params?.id as string;
  const [offset, setOffset] = useState(0);

  const { data: books, isPending, error } = useBooks(shelfId, offset, BOOKS_PER_PAGE);

  const handleNextPage = () => {
    setOffset(prevOffset => prevOffset + BOOKS_PER_PAGE);
  };

  const handlePreviousPage = () => {
    setOffset(prevOffset => Math.max(0, prevOffset - BOOKS_PER_PAGE));
  };

  const handlePageClick = (pageNumber: number) => {
    setOffset((pageNumber - 1) * BOOKS_PER_PAGE);
  };

  const currentPage = Math.floor(offset / BOOKS_PER_PAGE) + 1;
  const totalPages = books ? Math.ceil((offset + books.length) / BOOKS_PER_PAGE) + (books.length === BOOKS_PER_PAGE ? 1 : 0) : 1;
  
  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 400
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <motion.main 
        className="p-6 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header avec animation */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Étagère Littéraire
          </h1>
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mb-4"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          />
          <p className="text-lg text-slate-600 font-medium">
            Collection n°{shelfId}
          </p>
        </motion.div>

        {/* États de chargement et erreur */}
        <AnimatePresence mode="wait">
          {isPending && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="loading"
            >
              <motion.div 
                className="inline-block w-8 h-8 border-4 border-blue-300 border-t-blue-600 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="mt-4 text-slate-600 text-lg">Chargement des livres...</p>
            </motion.div>
          )}

          {error && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              key="error"
            >
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 inline-block">
                <p className="text-red-600 text-lg font-medium">
                  ❌ Erreur lors du chargement
                </p>
              </div>
            </motion.div>
          )}

          {books && books.length === 0 && !isPending && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              key="empty"
            >
              <div className="bg-slate-100 rounded-xl p-8 inline-block">
                <p className="text-slate-600 text-lg">📚 Aucun livre trouvé dans cette étagère</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grille des livres */}
        <motion.div 
          className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={offset} // Force la réanimation lors du changement de page
        >
          {books?.map((book) => (
            <motion.div
              key={book.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", damping: 15, stiffness: 300 }}
            >
              <BookCard book={book} />
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination avec numéros de page */}
        <motion.div 
          className="flex justify-center items-center space-x-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {/* Bouton Précédent */}
          <motion.button
            onClick={handlePreviousPage}
            disabled={currentPage === 1 || isPending}
            className="px-4 py-2 bg-white/80 backdrop-blur-sm text-slate-600 font-medium rounded-lg border border-slate-200 hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            variants={buttonVariants}
            whileHover={currentPage === 1 || isPending ? {} : "hover"}
            whileTap={currentPage === 1 || isPending ? {} : "tap"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          {/* Numéros de page */}
          <div className="flex items-center space-x-1">
            {getPageNumbers().map((pageNum, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + index * 0.05, type: "spring", damping: 10 }}
              >
                {pageNum === '...' ? (
                  <span className="px-3 py-2 text-slate-400">...</span>
                ) : (
                  <motion.button
                    onClick={() => handlePageClick(pageNum as number)}
                    disabled={isPending}
                    className={`px-3 py-2 font-medium rounded-lg transition-all duration-200 ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                        : 'bg-white/80 backdrop-blur-sm text-slate-600 border border-slate-200 hover:bg-white hover:shadow-md hover:border-blue-300'
                    }`}
                    variants={buttonVariants}
                    whileHover={isPending ? {} : "hover"}
                    whileTap={isPending ? {} : "tap"}
                  >
                    {pageNum}
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>

          {/* Bouton Suivant */}
          <motion.button
            onClick={handleNextPage}
            disabled={isPending || (books && books.length < BOOKS_PER_PAGE)}
            className="px-4 py-2 bg-white/80 backdrop-blur-sm text-slate-600 font-medium rounded-lg border border-slate-200 hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            variants={buttonVariants}
            whileHover={isPending || (books && books.length < BOOKS_PER_PAGE) ? {} : "hover"}
            whileTap={isPending || (books && books.length < BOOKS_PER_PAGE) ? {} : "tap"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </motion.div>
      </motion.main>
    </div>
  );
}