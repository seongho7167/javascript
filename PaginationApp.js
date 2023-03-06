
export default class PaginationApp {
	/**
		private 변수 선언
		해당 변수값은 메서드를 활용해서 사용자가 값을 변경할 수 있도록 함
	*/
	#target;
	#now_page;
	#total_cnt;
	#page_size;
	#block_size;
	#total_page;
	#now_block;
	#last_page;
	#first_page;
	#next;
	#prev;
	#id_count;
	#pagination_id;
	#pagination;
	#search_column;
	#search_data;
	#st_date;
	#end_date;
	
	constructor(target, config) {
		
		if(this.#isEmpty(config['query_function']) && this.#isEmpty(config['total_cnt'])){
			console.error('config error: total count is undefined');
		}else {
			this.query_function = config['query_function']; // 페이징을 생성하기 위한 데이터 수량 정보를 불러오는 함수
			
			this.#target = target; // 페이징을 생성할 타겟 태그
			this.#search_column = config?.search_column === undefined ? '' : config.search_column; // 검색 컬럼 조건
			this.#search_data = config?.search_data === undefined ? '' : config.search_data; // 검색어
			this.#st_date = config?.st_date === undefined ? '' : config.st_date; // 기간조회 시작일
			this.#end_date = config?.end_date === undefined ? '' : config.end_date; // 기간조회 종료일
			this.#now_page = config?.now_page === undefined ? 1 : config.now_page; // 현재 페이지
			this.#total_cnt = config?.total_cnt === undefined ? 0 : config.total_cnt; // 현재 페이지
			this.#page_size = config?.page_size === undefined ? 20 : config.page_size; // 페이지당 row cnt
			this.#block_size = config?.block_size === undefined ? 10 : config.block_size; // 화면에 보여줄 페이지 링크 수
			this.query_function = config.query_function;
			this.#id_count = document.querySelectorAll('.my_pagination').length; // 한 페이지에 여러 페이징 생성시 필요한 넘버링
			this.#pagination_id = `P${this.#millisecond('sss')}${this.#id_count}`; // 생성된 페이징 객체 아이디
			this.#create_body(); // 페이징 바디 생성 메서드
			this.#pagination = document.querySelector('[pagination_id="'+this.#pagination_id+'"]'); // 생성된 페이징 객체
			this.#draw_pagination(); // 페이징 그리기 메서드
			
			// 페이징 클릭 이벤트 
			this.#pagination.addEventListener('click', (event) => {
				this.parse(event); // 페이징 재생성
			});
			
		}
		
	}
	
	#create_body(){
		
		let pagination_body;
		pagination_body = document.createDocumentFragment();
		let body_tag = document.createElement('ul');
		body_tag.className = 'my_pagination';
		body_tag.setAttribute('pagination_id',this.#pagination_id);
		
		pagination_body.appendChild(body_tag);
		document.querySelector(this.#target).appendChild(pagination_body);
		
	}
	
	#draw_pagination(){
		this.#total_page = Math.ceil(this.#total_cnt / this.#page_size); // 총 페이지 수
		this.#now_block = Math.ceil(this.#now_page / this.#block_size); // 현재 페이지 블럭
		this.#last_page = this.#now_block * this.#block_size; // 현재 페이지 블럭의 마지막 페이지
		if (this.#last_page > this.#total_page) this.#last_page = this.#total_page;
		this.#first_page = this.#last_page - (this.#block_size - 1) <= 0 ? 1 : this.#last_page - (this.#block_size - 1); // 현재 페이지 블럭의 시작 페이지
		this.#next = this.#total_page < (this.#last_page + 1) ? this.#total_page : (this.#last_page + 1);
		this.#prev = (this.#first_page - 1) > 0 ? (this.#first_page - 1) : 1 ;
		
		let fragmentPage = '';
		
		if(this.#pagination.childNodes.length > 0){
			this.#pagination.removeChild(document.querySelector(".allpre"));
			this.#pagination.removeChild(document.querySelector(".preli"));
			document.querySelectorAll(".pitem").forEach((item)=>{
				this.#pagination.removeChild(item);
			});
			this.#pagination.removeChild(document.querySelector(".endli"));
			this.#pagination.removeChild(document.querySelector(".allendli"));
		}
		
		
		fragmentPage = document.createDocumentFragment();
		
		let allpreli = document.createElement('li');
		allpreli.className = "allpre";
		const prev_icon = '<i class= "xi-angle-left"></i>';
		allpreli.insertAdjacentHTML("beforeend", `<span id='allprev' data-num='1'>${prev_icon}${prev_icon}</span>`);
		
		let preli = document.createElement('li');
		preli.className = "preli";
		preli.insertAdjacentHTML("beforeend", `<span id='prev' data-num='${this.#prev}'>${prev_icon}</span>`);
		
		fragmentPage.appendChild(allpreli);
		fragmentPage.appendChild(preli);
		
		for (let i = this.#first_page; i <= this.#last_page; i++) {
			const li = document.createElement("li");
			li.className = "pitem";
			if(i <= this.#last_page){
				i === Number(this.#now_page) ? li.insertAdjacentHTML("beforeend", `<span id='page-${i}' class='active' data-num='${i}'>${i}</span>`) : li.insertAdjacentHTML("beforeend", `<span id='page-${i}' data-num='${i}'>${i}</span>`);
			}else {
				li.insertAdjacentHTML("beforeend", `<span></span>`);
			}
			fragmentPage.appendChild(li);
		}
		
		const end_icon = '<i class= "xi-angle-right"></i>';
		let allendli = document.createElement('li');
		allendli.className = "allendli";
		allendli.insertAdjacentHTML("beforeend", `<span id='allnext' data-num='${this.#total_page}'>${end_icon}${end_icon}</span>`);
		
		let endli = document.createElement('li');
		endli.className = "endli";
		endli.insertAdjacentHTML("beforeend", `<span  id='next' data-num='${this.#next}'>${end_icon}</span>`);
		
		fragmentPage.appendChild(endli);
		fragmentPage.appendChild(allendli);
		
		document.querySelector('[pagination_id="'+this.#pagination_id+'"]').appendChild(fragmentPage);
		
	}
		  
	parse(e){
		let target_node;
		
		if(!this.#isEmpty(e.target.nodeName)){
			if(e.target.nodeName === 'SPAN'){
				target_node = e.target;
			}else if(e.target.nodeName === 'LI'){
				target_node = e.target.childNodes[0];
			}else if(e.target.nodeName === 'I'){
				target_node = e.target.parentNode;
			}
			if(!this.#isEmpty(target_node)){
				
				let target_page = Number(target_node.getAttribute('data-num'));
				let target_id = target_node.getAttribute('id');
				
				if(Number(target_page) !== this.#now_page){
					this.#now_page = target_page;
					this.#draw_pagination();
					this.#pagination.childNodes.forEach(function(node){
						if(node.childNodes[0].getAttribute('data-num') !== target_page && node.childNodes[0].classList.contains('active')){
							node.childNodes[0].classList.remove('active');
						}
						if(node.childNodes[0].getAttribute('id') === `page-${target_page}`){
							node.childNodes[0].classList.add('active');
						}
					});
				}
			}else {
				console.error('target node error: target node is undefined');
			}
		}else {
			console.error('target error: target is undefined');
		}
	}
	
	u_parse = (data) => {
		this.#now_page = data?.now_page === undefined ? this.#now_page : data.now_page;
		this.#page_size = data?.page_size === undefined ? this.#page_size : data.page_size;
		this.#search_column = data?.search_column === undefined ? '' : data.search_column;
		this.#search_data = data?.search_data === undefined ? '' : data.search_data;
		this.#st_date = data?.st_date === undefined ? '' : data.st_date;
		this.#end_date = data?.end_date === undefined ? '' : data.end_date;
		
		this.#draw_pagination();
	}
	
	get_total_cnt(){
		return this.#total_cnt;
	}
	
	set_total_cnt(value){
		if( Number.isInteger(value) ){
			if(value >= 0){
				this.#total_cnt = value;
				this.#draw_pagination();
			}else {
				console.error('error: total_cnt value error');
			}
		}else {
			console.error('type error: set_total_cnt arg is not Number type');
		}
	}
	
	set_now_page(value){
		if( Number.isInteger(value) ){
			if(value >= 0){
				this.#now_page = value;
				this.#draw_pagination();
			}else {
				console.error('error: total_cnt value error');
			}
		}else {
			console.error('type error: set_total_cnt arg is not Number type');
		}
	}
	
	#isEmpty(value){
		if(value === '' || value === null || value === undefined || value === 'null' || value === '0' || value === 0){
			return true;
		}else {
			return false;
		}
	}
	
	#millisecond(type=null){
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
			return `${n_year}-${n_mon}-${n_date} ${n_hours}:${n_minutes}:${n_seconds}.${n_milliseconds}`;
		}else {
			return `${n_year}${n_mon}${n_date}${n_hours}${n_minutes}${n_seconds}${n_milliseconds}`;
		}
		
	}
}