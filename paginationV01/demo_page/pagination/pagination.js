
import Pagination from '../../demo_module/pagination/pagination_module.js';

(function(){
	
	let pagination_config = {
		now_page: 1,
		total_cnt: 999,
		page_size: 20,
		block_size: 10,
	};

	const pagination = new Pagination('',pagination_config);
	pagination.uDraw();

})()
