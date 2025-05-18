const GenderCheckbox = ({ onCheckboxChange, selectedGender }) => {
	return (
		<div className='flex flex-row gap-5'>
			<div className='form-control'>
				<label className={`label gap-2 cursor-pointer ${selectedGender === "male" ? "selected" : ""} `}>
				<div className="flex flex-row gap-2">
					<input
						type='checkbox'
						className='checkbox border-slate-900'
						checked={selectedGender === "male"}
						onChange={() => onCheckboxChange("male")}
					/>
					<span className='label-text'>Male</span>
				</div>
				</label>
			</div>

			<div className='form-control'>
				<label className={`label gap-2 cursor-pointer  ${selectedGender === "female" ? "selected" : ""}`}>
				<div className="flex flex-row gap-2">
					<input
						type='checkbox'
						className='checkbox border-slate-900'
						checked={selectedGender === "female"}
						onChange={() => onCheckboxChange("female")}
					/>
					<span className='label-text'>Female</span>
				</div>
				</label>
			</div>
		</div>
	);
};
export default GenderCheckbox;