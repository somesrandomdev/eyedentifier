import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { IdCardForm } from '../../types/idCard';
import { SENEGAL_FIRST_NAMES, SENEGAL_LAST_NAMES, SENEGAL_PROFESSIONS } from '../../utils/senegalUtils';

const idCardSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  prenoms: z.string().min(2, 'Les prénoms doivent contenir au moins 2 caractères'),
  date_naissance: z.string().min(1, 'La date de naissance est requise'),
  lieu_naissance: z.string().min(2, 'Le lieu de naissance est requis'),
  sexe: z.enum(['M', 'F'], { required_error: 'Le sexe est requis' }),
  taille_cm: z.number().min(50, 'La taille doit être d\'au moins 50 cm').max(250, 'La taille ne peut pas dépasser 250 cm'),
  profession: z.string().min(2, 'La profession est requise'),
  adresse: z.string().min(10, 'L\'adresse complète est requise'),
  telephone: z.string().min(9, 'Le numéro de téléphone est invalide'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  gdprConsent: z.boolean().refine(val => val === true, 'Le consentement RGPD est requis'),
});

export default function IdCardEnrollmentData() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IdCardForm>({
    resolver: zodResolver(idCardSchema),
    defaultValues: {
      sexe: 'M',
      taille_cm: 170,
    }
  });

  const onSubmit = async (data: IdCardForm) => {
    setIsSubmitting(true);
    
    // Stocker les données temporairement
    sessionStorage.setItem('idCardData', JSON.stringify(data));
    
    // Simuler un délai
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/enroler/photo');
    }, 1000);
  };

  const fillRandomData = () => {
    const firstName = SENEGAL_FIRST_NAMES[Math.floor(Math.random() * SENEGAL_FIRST_NAMES.length)];
    const lastName = SENEGAL_LAST_NAMES[Math.floor(Math.random() * SENEGAL_LAST_NAMES.length)];
    const profession = SENEGAL_PROFESSIONS[Math.floor(Math.random() * SENEGAL_PROFESSIONS.length)];
    
    // You would need to add these to the form values somehow
    console.log('Random data:', { firstName, lastName, profession });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Informations personnelles</h1>
        <p className="text-gray-600 mt-2">Étape 1 sur 4 - Saisie des données pour la CNI sénégalaise</p>
        
        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary">Progression</span>
            <span className="text-sm text-gray-500">25%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: '25%' }}></div>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit(onSubmit)}
        className="glass-card space-y-6"
      >
        {/* Nom et Prénoms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
              Nom de famille *
            </label>
            <input
              {...register('nom')}
              type="text"
              className="input-field"
              placeholder="DIALLO"
            />
            {errors.nom && (
              <p className="text-red-600 text-sm mt-1">{errors.nom.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="prenoms" className="block text-sm font-medium text-gray-700 mb-2">
              Prénoms *
            </label>
            <input
              {...register('prenoms')}
              type="text"
              className="input-field"
              placeholder="MOUHAMADOU"
            />
            {errors.prenoms && (
              <p className="text-red-600 text-sm mt-1">{errors.prenoms.message}</p>
            )}
          </div>
        </div>

        {/* Date et lieu de naissance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="date_naissance" className="block text-sm font-medium text-gray-700 mb-2">
              Date de naissance *
            </label>
            <input
              {...register('date_naissance')}
              type="date"
              className="input-field"
            />
            {errors.date_naissance && (
              <p className="text-red-600 text-sm mt-1">{errors.date_naissance.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="lieu_naissance" className="block text-sm font-medium text-gray-700 mb-2">
              Lieu de naissance *
            </label>
            <input
              {...register('lieu_naissance')}
              type="text"
              className="input-field"
              placeholder="MBOUMBA"
            />
            {errors.lieu_naissance && (
              <p className="text-red-600 text-sm mt-1">{errors.lieu_naissance.message}</p>
            )}
          </div>
        </div>

        {/* Sexe et Taille */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="sexe" className="block text-sm font-medium text-gray-700 mb-2">
              Sexe *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  {...register('sexe')}
                  type="radio"
                  value="M"
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Masculin</span>
              </label>
              <label className="flex items-center">
                <input
                  {...register('sexe')}
                  type="radio"
                  value="F"
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Féminin</span>
              </label>
            </div>
            {errors.sexe && (
              <p className="text-red-600 text-sm mt-1">{errors.sexe.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="taille_cm" className="block text-sm font-medium text-gray-700 mb-2">
              Taille (cm) *
            </label>
            <input
              {...register('taille_cm', { valueAsNumber: true })}
              type="number"
              min="50"
              max="250"
              className="input-field"
              placeholder="175"
            />
            {errors.taille_cm && (
              <p className="text-red-600 text-sm mt-1">{errors.taille_cm.message}</p>
            )}
          </div>
        </div>

        {/* Profession */}
        <div>
          <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-2">
            Profession *
          </label>
          <input
            {...register('profession')}
            type="text"
            className="input-field"
            placeholder="Commerçant"
          />
          {errors.profession && (
            <p className="text-red-600 text-sm mt-1">{errors.profession.message}</p>
          )}
        </div>

        {/* Adresse */}
        <div>
          <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-2">
            Adresse complète *
          </label>
          <textarea
            {...register('adresse')}
            rows={3}
            className="input-field resize-none"
            placeholder="Adresse complète du domicile"
          />
          {errors.adresse && (
            <p className="text-red-600 text-sm mt-1">{errors.adresse.message}</p>
          )}
        </div>

        {/* Téléphone et Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone *
            </label>
            <input
              {...register('telephone')}
              type="tel"
              className="input-field"
              placeholder="+221 77 123 45 67"
            />
            {errors.telephone && (
              <p className="text-red-600 text-sm mt-1">{errors.telephone.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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

        {/* Consentement RGPD */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              {...register('gdprConsent')}
              type="checkbox"
              className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded mt-0.5"
            />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Consentement RGPD *</p>
              <p>
                J'autorise la collecte et le traitement de mes données personnelles (photo, données biométriques d'iris, 
                informations d'identité) à des fins d'établissement de la carte d'identité nationale du Sénégal. 
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
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin-slow w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <span>Continuer vers la photo</span>
                <ChevronRightIcon className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}