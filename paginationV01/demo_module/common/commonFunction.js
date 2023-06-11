
export default class commonFunction {
	static millisecond(type=null){
		let result = '';
		let now = new Date();
		let n_year = now.getFullYear();
		let n_mon = (now.getMonth() + 1);
		let n_date = now.getDate();
		let n_hours = now.getHours();
		let n_minutes = now.getMinutes();
		let n_seconds = now.getSeconds();
		let n_milliseconds = now.getMilliseconds();
		n_mon = n_mon < 10 ? `0${n_mon}` : n_mon;
		n_date = n_date < 10 ? `0${n_date}` : n_date;
		n_hours = n_hours < 10 ? `0${n_hours}` : n_hours;
		n_minutes = n_minutes < 10 ? `0${n_minutes}` : n_minutes;
		n_seconds = n_seconds < 10 ? `0${n_seconds}` : n_seconds;
	
		if(type === null){
			n_milliseconds = n_milliseconds < 10 ? `00${n_milliseconds}` : n_milliseconds > 10 && n_milliseconds < 100 ? `0${n_milliseconds}` : n_milliseconds;
		}
		
		result = type === null ? `${n_year}-${n_mon}-${n_date} ${n_hours}:${n_minutes}:${n_seconds}.${n_milliseconds}` : `${n_year}${n_mon}${n_date}${n_hours}${n_minutes}${n_seconds}${n_milliseconds}`;
		
		return result;
	}
	
	static isEmpty(value){
		const result = value === '' || value === null || value === undefined || value === 'null' || value === '0' || value === 0 ? true : false;
		
		return result;
	}
	
	static myError(error){
		console.error(error.stack);
	}
}