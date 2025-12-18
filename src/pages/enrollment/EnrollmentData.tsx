import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Stepper from '../../components/ui/Stepper';
import Button from '../../components/Button';

const enrollmentSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  birthDate: z.string().min(1, 'La date de naissance est requise'),
  birthPlace: z.string().min(2, 'Le lieu de naissance est requis'),
  gender: z.enum(['M', 'F'], { required_error: 'Le genre est requis' }),
  address: z.string().min(10, 'L\'adresse complète est requise'),
  phone: z.string().min(9, 'Le numéro de téléphone est invalide'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  height: z.string().min(1, 'La taille est requise'),
  profession: z.string().min(2, 'La profession est requise'),
  gdprConsent: z.boolean().refine(val => val === true, 'Le consentement RGPD est requis'),
});

type EnrollmentData = z.infer<typeof enrollmentSchema>;

export default function EnrollmentData() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EnrollmentData>({
    resolver: zodResolver(enrollmentSchema),
  });

  const onSubmit = async (data: EnrollmentData) => {
    setIsSubmitting(true);
    
    // Stocker les données temporairement
    sessionStorage.setItem('enrollmentData', JSON.stringify(data));
    
    // Simuler un délai
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/enroler/photo');
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Informations personnelles</h1>
        <p className="text-neutral-500 mt-2">Étape 1 sur 4 - Saisie des données du citoyen</p>

        {/* Stepper */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-primary">Progression</span>
            <span className="text-sm text-neutral-500">Étape 1 sur 4</span>
          </div>
          <Stepper current={1} total={4} />
        </div>
      </div>

      {/* Formulaire */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-subtle border border-neutral-100 p-6 animate-fade-in space-y-6"
      >
        {/* Nom et Prénom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-neutral-900 mb-2">
              Prénom *
            </label>
            <input
              {...register('firstName')}
              type="text"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-0 px-4 py-3 text-sm placeholder-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              placeholder="Entrez le prénom"
            />
            {errors.firstName && (
              <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-neutral-900 mb-2">
              Nom *
            </label>
            <input
              {...register('lastName')}
              type="text"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-0 px-4 py-3 text-sm placeholder-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              placeholder="Entrez le nom"
            />
            {errors.lastName && (
              <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Date et lieu de naissance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="birthDate" className="input-label">
              Date de naissance *
            </label>
            <input
              {...register('birthDate')}
              type="date"
              className="input-field"
            />
            {errors.birthDate && (
              <p className="text-red-600 text-sm mt-1">{errors.birthDate.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="birthPlace" className="input-label">
              Lieu de naissance *
            </label>
            <input
              {...register('birthPlace')}
              type="text"
              className="input-field"
              placeholder="Ville de naissance"
            />
            {errors.birthPlace && (
              <p className="text-red-600 text-sm mt-1">{errors.birthPlace.message}</p>
            )}
          </div>
        </div>

        {/* Genre */}
        <div>
          <label className="input-label">
            Genre *
          </label>
          <div className="flex space-x-6">
            <label className="flex items-center">
              <input
                {...register('gender')}
                type="radio"
                value="M"
                className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Masculin</span>
            </label>
            <label className="flex items-center">
              <input
                {...register('gender')}
                type="radio"
                value="F"
                className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Féminin</span>
            </label>
          </div>
          {errors.gender && (
            <p className="text-red-600 text-sm mt-1">{errors.gender.message}</p>
          )}
        </div>

        {/* Adresse */}
        <div>
          <label htmlFor="address" className="input-label">
            Adresse complète *
          </label>
          <textarea
            {...register('address')}
            rows={3}
            className="input-field resize-none"
            placeholder="Adresse complète du domicile"
          />
          {errors.address && (
            <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
          )}
        </div>

        {/* Téléphone et Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="input-label">
              Téléphone *
            </label>
            <input
              {...register('phone')}
              type="tel"
              className="input-field"
              placeholder="+221 XX XXX XX XX"
            />
            {errors.phone && (
              <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="input-label">
              Email (optionnel)
            </label>
            <input
              {...register('email')}
              type="email"
              className="input-field"
              placeholder="email@exemple.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Taille et Profession */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="height" className="input-label">
              Taille (cm) *
            </label>
            <input
              {...register('height')}
              type="text"
              className="input-field"
              placeholder="170"
            />
            {errors.height && (
              <p className="text-red-600 text-sm mt-1">{errors.height.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="profession" className="input-label">
              Profession *
            </label>
            <input
              {...register('profession')}
              type="text"
              className="input-field"
              placeholder="Profession ou métier"
            />
            {errors.profession && (
              <p className="text-red-600 text-sm mt-1">{errors.profession.message}</p>
            )}
          </div>
        </div>

        {/* Consentement RGPD */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              {...register('gdprConsent')}
              type="checkbox"
              className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded mt-0.5"
            />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">Consentement RGPD *</p>
              <p className="leading-relaxed">
                J'autorise la collecte et le traitement de mes données personnelles (photo, données biométriques d'iris)
                à des fins d'identification dans le cadre du système de carte d'identité nationale du Sénégal.
                Ces données seront conservées de manière sécurisée et ne seront pas partagées avec des tiers non autorisés.
              </p>
            </div>
          </label>
          {errors.gdprConsent && (
            <p className="text-red-600 text-sm mt-2">{errors.gdprConsent.message}</p>
          )}
        </div>


        {/* Bouton de soumission */}
        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="primary"
            className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 active:scale-95 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            loading={isSubmitting}
          >
            {!isSubmitting && (
              <>
                <span>Continuer vers la photo</span>
                <ChevronRightIcon className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </motion.form>
    </div>
  );
}