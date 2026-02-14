import PropTypes from 'prop-types'

export default function InputField({ label, value, onChange }) {
  const handleInputChange = (e) => {
    if (/^\d*$/.test(e.target.value)) onChange(e)
  }

  return (
    <div className="text-lg flex items-center justify-between my-1 w-full">
      <label className="text-cyan-accent pr-4">{label}</label>
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        className="w-28 bg-metal-dark text-nixie-orange text-center text-2xl border border-metal-light focus:outline-none focus:ring-2 focus:ring-cyan-accent"
      />
    </div>
  )
}

// Validação das props
InputField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired
}
