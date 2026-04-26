import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewService } from '../../services/providerService'
import { StarRating } from '../ui'
import toast from 'react-hot-toast'
import { Trash2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

/* ─── ReviewCard ──────────────────────────────────────────── */
export function ReviewCard({ review, providerId }) {
  const { user, isAdmin } = useAuth()
  const queryClient = useQueryClient()
  const canDelete = isAdmin || user?.id === review.reviewer?.id

  const deleteMutation = useMutation({
    mutationFn: () => reviewService.destroy(review.id),
    onSuccess: () => {
      queryClient.invalidateQueries(['provider', String(providerId)])
      toast.success('Review deleted')
    },
  })

  const reviewer = review.reviewer || {}
  const initials = reviewer.name ? reviewer.name[0].toUpperCase() : '?'

  return (
    <div className="flex gap-3 py-4 border-b border-slate-100 last:border-0">
      <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center shrink-0 text-brand-600 font-semibold text-sm">
        {reviewer.profile_photo_url
          ? <img src={reviewer.profile_photo_url} alt={reviewer.name} className="w-full h-full rounded-full object-cover" />
          : initials
        }
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-slate-800 text-sm">{reviewer.name}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <StarRating rating={review.rating} size="sm" />
              <span className="text-xs text-slate-400">
                {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
          {canDelete && (
            <button
              onClick={() => deleteMutation.mutate()}
              className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {review.comment && <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{review.comment}</p>}
      </div>
    </div>
  )
}

/* ─── ReviewForm ──────────────────────────────────────────── */
export function ReviewForm({ providerId }) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [rating, setRating]   = useState(0)
  const [comment, setComment] = useState('')
  const [errors, setErrors]   = useState({})

  const mutation = useMutation({
    mutationFn: () => reviewService.create(providerId, { rating, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries(['provider', String(providerId)])
      setRating(0)
      setComment('')
      toast.success('Review submitted!')
    },
    onError: (err) => {
      const data = err.response?.data
      if (data?.message) toast.error(data.message)
      if (data?.errors) setErrors(data.errors)
    },
  })

  if (!user) return (
    <p className="text-sm text-slate-500 italic">
      <a href="/login" className="text-brand-500 font-medium">Log in</a> to leave a review.
    </p>
  )

  return (
    <div className="bg-slate-50 rounded-xl p-4 mt-4">
      <h4 className="font-semibold text-slate-800 mb-3">Write a Review</h4>
      <div className="mb-3">
        <p className="text-xs text-slate-500 mb-1">Your rating</p>
        <StarRating rating={rating} size="lg" interactive onChange={setRating} />
        {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating[0]}</p>}
      </div>
      <textarea
        rows={3}
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Share your experience…"
        className="input resize-none w-full text-sm mb-3"
      />
      <button
        onClick={() => mutation.mutate()}
        disabled={rating === 0 || mutation.isPending}
        className="btn-primary text-sm py-2"
      >
        {mutation.isPending ? 'Submitting…' : 'Submit Review'}
      </button>
    </div>
  )
}
