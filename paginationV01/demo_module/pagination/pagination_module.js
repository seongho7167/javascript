/**
 * 양성호
 * 20230611
 * 페이지네이션 class 사용 무료 배포 버전
*/
import commonFunction from '../common/commonFunction.js';
export default class PaginationApp {
	#root;
	#target;
	#config;
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
	#paginationChildNodes;
	#pageBodyFragment;
	#pageItemsFragment;
	#search_column;
	#search_data;
	#st_date;
	#end_date;
	
	constructor(target, config = null) {
		
		try{
			
			if(commonFunction.isEmpty(config)){
				throw new Error("config error: config is null", 'pagination_module.js', 48);
			}else {
				this.#now_page = config?.now_page === undefined ? 1 : config.now_page; // 현재 페이지
				this.#total_cnt = config?.total_cnt === undefined ? 0 : config.total_cnt; // 현재 페이지
				this.#page_size = config?.page_size === undefined ? 20 : config.page_size; // 페이지당 row cnt
				this.#block_size = config?.block_size === undefined ? 10 : config.block_size; // 화면에 보여줄 페이지 링크 수
				this.#config = config;
			}
			
			if(commonFunction.isEmpty(config['total_cnt'])){
				throw new Error("config error: total count is undefined", 'pagination_module.js', 60);
			}else {
				this.#target = commonFunction.isEmpty(target) ? 'body' : target; // 페이징을 생성할 타겟 태그
				this.#root = document.querySelector(this.#target);
				this.#id_count = document.querySelectorAll('.my_pagination').length; // 한 페이지에 여러 페이징 생성시 필요한 넘버링
				this.#pagination_id = `P${commonFunction.millisecond('sss')}${this.#id_count}`; // 생성된 페이징 객체 아이디
				this.#pageBodyFragment = this.#create_body(); // 페이징 바디 생성 메서드
				this.#pageItemsFragment = this.#create_pagination(); // 페이징 태그 생성 메서드
			}
			
		}catch(e){
			commonFunction.myError(e);
		}
	}

	#create_body(){
		
		let pagination_body;
		pagination_body = document.createDocumentFragment();
		let body_tag = document.createElement('ul');
		body_tag.className = 'my_pagination';
		body_tag.setAttribute('pagination_id',this.#pagination_id);
		pagination_body.appendChild(body_tag);
		
		return pagination_body;
		
	}
	
	#create_pagination(){
		this.#total_page = Math.ceil(this.#total_cnt / this.#page_size); // 총 페이지 수
		this.#now_block = Math.ceil(this.#now_page / this.#block_size); // 현재 페이지 블럭
		this.#last_page = this.#now_block * this.#block_size; // 현재 페이지 블럭의 마지막 페이지
		if (this.#last_page > this.#total_page) this.#last_page = this.#total_page;
		this.#first_page = this.#last_page - (this.#block_size - 1) <= 0 ? 1 : this.#last_page - (this.#block_size - 1); // 현재 페이지 블럭의 시작 페이지
		this.#next = this.#total_page < (this.#last_page + 1) ? this.#total_page : (this.#last_page + 1);
		this.#prev = (this.#first_page - 1) > 0 ? (this.#first_page - 1) : 1 ;
		
		let fragmentPage = '';
		
		if(!commonFunction.isEmpty(this.#pagination)){
			if(this.#pagination.childNodes.length > 0){
				while(this.#pagination.firstChild){
					this.#pagination.firstChild.remove();
				}
			}
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

		return fragmentPage;
	}
	
	#init(){
		try{
			if(commonFunction.isEmpty(this.#config)){
				throw new Error("config error: config is null", 'pagination_module.js');
			}else {
				this.#now_page = this.#config?.now_page === undefined ? 1 : this.#config.now_page; // 현재 페이지
				this.#total_cnt = this.#config?.total_cnt === undefined ? 0 : this.#config.total_cnt; // 현재 페이지
				this.#page_size = this.#config?.page_size === undefined ? 20 : this.#config.page_size; // 페이지당 row cnt
				this.#block_size = this.#config?.block_size === undefined ? 10 : this.#config.block_size; // 화면에 보여줄 페이지 링크 수
			}
			
			this.#root.appendChild(this.#pageBodyFragment); // 페이징 바디 추가
			
			this.#pagination = document.querySelector('[pagination_id="'+this.#pagination_id+'"]'); // 생성된 페이징 객체
			
			this.#paginationChildNodes = this.#pagination.childNodes; // 페이징 자식 노드 
			
			if(this.#paginationChildNodes.length === 0){ // 최초 1회만 이벤트 추가
				this.#pagination.addEventListener('click', (event) => {
					this.#parse(event); // 페이징 재생성
				});
			}
			
			this.#pagination.appendChild(this.#pageItemsFragment); // 페이징 자식 노드 추가
		}catch(e) {
			commonFunction.myError(e);
		}
		
	}
	
	
	#draw(){
		this.#root.appendChild(this.#pageBodyFragment);
		this.#pagination = document.querySelector('[pagination_id="'+this.#pagination_id+'"]'); // 생성된. 페이징 객체
		try{
			this.#pageItemsFragment = this.#create_pagination();
			this.#pagination.appendChild(this.#pageItemsFragment);
		}catch(e){
			commonFunction.myError(e);
		}
		
	}
	  
	#parse(e){
		let target_node;
		try {
			if(!commonFunction.isEmpty(e.target.nodeName)){
				if(e.target.nodeName === 'SPAN'){
					target_node = e.target;
				}else if(e.target.nodeName === 'LI'){
					target_node = e.target.childNodes[0];
				}else if(e.target.nodeName === 'I'){
					target_node = e.target.parentNode;
				}
				if(!commonFunction.isEmpty(target_node)){
					
					let target_page = Number(target_node.getAttribute('data-num'));
					let target_id = target_node.getAttribute('id');
					
					if(Number(target_page) !== this.#now_page){
						this.#now_page = target_page;
						this.#pageItemsFragment = this.#create_pagination();
						document.querySelector('[pagination_id="'+this.#pagination_id+'"]').appendChild(this.#pageItemsFragment);
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
					
					if(e.target.nodeName !== 'UL'){
						throw new Error("reference error: target node is undefined", 'pagination_module.js');
					}
					
				}
			}else {
				
				if(e.target.nodeName !== 'UL'){
					throw new Error("reference error: target is undefined", 'pagination_module.js');
				}
				
			}
		}catch (e){
			commonFunction.myError(e);
		}
		
	}
	
	uParse(data){
		this.#now_page = data?.now_page === undefined ? this.#now_page : data.now_page;
		this.#total_cnt = data?.total_cnt === undefined ? this.#total_cnt : data.total_cnt;
		this.#page_size = data?.page_size === undefined ? 20 : data.page_size; // 페이지당 row cnt
		this.#block_size = data?.block_size === undefined ? 10 : data.block_size; // 화면에 보여줄 페이지 링크 수
		this.#draw();
	}
	
	uDestroy(){
		this.#root.childNodes.forEach((node) => { if(node === this.#pagination) this.#root.removeChild(node); });
	}
	
	uDraw(){
		this.#init();
	}
	
	uGet = {
		totalCnt: this.totalCnt.bind(this),
		info: this.info.bind(this),
	};
	
	totalCnt(){
		return this.#total_cnt
	};
	
	info(){
		return {
			now_page: this.#now_page,
			total_cnt: this.#total_cnt,
			page_size: this.#page_size,
			block_size: this.#block_size,
		};
	};
	

	set_total_cnt(value){
		try{
			if( Number.isInteger(value) ){
				if(value >= 0){
					this.#total_cnt = value;
					this.#create_pagination();
				}else {
					throw new Error("error: total_cnt value error", 'pagination_module.js');
				}
			}else {
				throw new Error("type error: set_total_cnt arg is not Number type", 'pagination_module.js');
			}
		}catch(e){
			commonFunction.myError(e);
		}
	}
	
	set_now_page(value){
		
		try{
			if( Number.isInteger(value) ){
				if(value >= 0){
					this.#now_page = value;
					this.#create_pagination();
				}else {
					throw new Error("error: total_cnt value error");
				}
			}else {
				throw new Error("type error: set_total_cnt arg is not Number type");
			}
		}catch(e){
			commonFunction.myError(e);
		}
	}
}