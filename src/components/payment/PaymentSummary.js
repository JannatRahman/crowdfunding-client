import { formatCurrency } from '@/utils/formatters';

export default function PaymentSummary({ campaign, amount }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
      <h3 className="font-semibold text-gray-900">Payment Summary</h3>

      <div className="flex items-center gap-3">
        {campaign?.images?.[0] ? (
          <img src={campaign.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white">
            🚀
          </div>
        )}
        <div>
          <p className="font-medium text-gray-900 text-sm line-clamp-1">{campaign?.title}</p>
          <p className="text-xs text-gray-500">Campaign contribution</p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Contribution</span>
          <span className="font-medium">{formatCurrency(amount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Processing fee</span>
          <span className="font-medium">{formatCurrency(0)}</span>
        </div>
        <div className="border-t border-gray-200 pt-2 flex justify-between">
          <span className="font-semibold">Total</span>
          <span className="font-semibold text-lg">{formatCurrency(amount)}</span>
        </div>
      </div>
    </div>
  );
}
