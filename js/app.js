var List = new Vue({
    el: '#page-list',
    data: {
        cate_index: 0, // 当前分类项下标
        filter_index: 0, // 当前条件筛选项下标
        price_isAsc: false, // 价格是否升序
        cate: [
            { id: 0, des: '今日推荐' },
            { id: 1, des: '韩式花艺' },
            { id: 2, des: '婚纱系列' },
            { id: 3, des: '初恋系列' },
            { id: 4, des: '闺蜜系列' }
        ],
        sortMethods: [
            { name: '综合排序', method: 'setList' },
            { name: '销量优先', method: 'sortSales' }
        ],
        goods: [{
            id: 1001,
            name: '韩式花艺',
            price: 388,
            type: 1,
            stock: 128,
            sales: 188,
            img: 'images/3.jpg'
        }, {
            id: 1002,
            name: '韩式花艺',
            price: 99,
            type: 1,
            stock: 5,
            sales: 299,
            img: 'images/3.jpg'
        }, {
            id: 1003,
            name: '婚纱系列',
            price: 299,
            type: 2,
            stock: 2,
            sales: 351,
            ishot: true,
             img: 'images/3.jpg'
        }, {
            id: 1004,
            name: '婚纱系列',
            price: 520,
            type: 2,
            stock: 465,
            sales: 888,
            img: 'images/3.jpg'
        }, {
            id: 1005,
            name: '初恋系列',
            price: 199,
            type: 3,
            stock: 154,
            sales: 999,
             img: 'images/3.jpg'
        }, {
            id: 1006,
            name: '初恋系列',
            price: 167,
            type: 3,
            stock: 12,
            sales: 66,
            img: 'images/3.jpg'
        }, {
            id: 1007,
            name: '闺蜜系列',
            price: 225,
            type: 4,
            stock: 3,
            sales: 395,
           img: 'images/3.jpg'
        }, {
            id: 1008,
            name: '闺蜜系列',
            price: 489,
            type:4,
            stock: 18,
            sales: 69,
            ishot: true,
            img: 'images/3.jpg'
        }],
        list: []
    },
    created: function () {
        this.setList()
    },
    methods: {

        /**
         * @method 设置商品列表
         */
        setList: function () {
            var self = this;
            this.list = this.goods.filter(function (item) {
                return self.cate_index !== 0
                    ? item.type === self.cate_index 
                    : item
            });
        },

        /**
         * @method 切换分类
         * @param {Number} index 需要切换类目的数组下标
         */
        toggleCate: function (index) {
            this.cate_index = index;
            // 分类操作
            this.setList();
            // 价格排序状态保持不变
            var filterIndex = this.filter_index;
            (filterIndex === 2) && (this.price_isAsc = !this.price_isAsc);
            // 商品排序
            this.sortBy(this.sortMethods[filterIndex].method);
        },

        /**
         * 根据属性值进行升序或降序的比较器
         * 
         * @method 属性比较器
         * @param {String} prop 属性名
         * @param {String} type 排序方法 (desc: 降序, asc: 升序)
         */
        compare: function (prop, type) {
            type = type || 'desc';

            var flag1, flag2;
            if (type === 'desc') {
                flag1 = -1;
                flag2 = 1;
            } else if (type === 'asc') {
                flag1 = 1;
                flag2 = -1;
            }

            return function (obj1, obj2) {
                var val1 = obj1[prop],
                    val2 = obj2[prop];

                if (val2 < val1) {
                    return flag1;
                } else if (val2 > val1) {
                    return flag2;
                } else {
                    return 0;
                }
            }
        },

        /**
         * @method 按销量排序
         */
        sortSales: function () {
            this.list.sort(this.compare('sales'));
        },

        /**
         * @method 按价格排序
         */
        sortPrice: function () {
            var type = this.price_isAsc ? 'desc' : 'asc';
            this.list.sort(this.compare('price', type));
            this.price_isAsc = !this.price_isAsc;
        },

        /**
         * @method 排序调度器
         * @param {String} method 方法名
         */
        sortBy: function (method) {
            this.filter_index = this.sortMethods.findIndex(function(item) {
                return item.method === method;
            });
            method = method || 'setList';
            method !== 'sortPrice' && (this.price_isAsc = false);
            this[method]();
        },

        /**
         * @method 添加到购物车
         * @param {Object} goods 商品
         */
        addToCart: function (goods) {
            var alreadyIndex = Cart.cart.findIndex(function (item, index) {
                return item.id === goods.id;
            });

            // 如果不存在则添加
            if (alreadyIndex === -1) {
                var cartIndex = Cart.cart.length;
                // 添加新的商品，并初始化其数量、价格、被选中状态
                Cart.cart.push(goods);
                Cart.$set(Cart.cart[cartIndex], 'quantity', 1);
                Cart.$set(Cart.cart[cartIndex], 'subtotal', goods.price.toFixed(1));
                Cart.$set(Cart.cart[cartIndex], 'checked', false);
                // 新增商品，购物车不能为全选
                Cart.checkAllFlag = false;
                return;
            }

            // 如果商品已存在并且库存足够，数量加1
            var alreadyGoods = Cart.cart[alreadyIndex];
            var num = alreadyGoods.quantity,
                stock = alreadyGoods.stock;

            if (num < stock) {
                Cart.$set(alreadyGoods, 'quantity', ++alreadyGoods.quantity);
                Cart.$set(alreadyGoods, 'subtotal', (alreadyGoods.price * alreadyGoods.quantity).toFixed(1));
            }
        }
    }
});

var Cart = new Vue({
    el: '#page-cart',
    data: {
        checkAllFlag: false,
        selectedNum: 0,
        delFlag: false,
        cart: []
    },
    methods: {

        /**
         * @method 增减单品数量
         * @param {Boolean} isAdd 是否增加
         * @param {Number} index 商品下标
         */
        changeQty: function (isAdd, item) {
            var num = item.quantity,
                stock = item.stock;

            if (isAdd && num < stock) {
                this.$set(item, 'quantity', ++num);
            } else if (!isAdd && num > 1) {
                this.$set(item, 'quantity', --num);
            }

            this.$set(item, 'subtotal', (item.price * num).toFixed(1));
        },

        /**
         * @method 选择商品
         * @param {Object} item 商品对象
         */
        selectGoods: function (item) {
            // 状态值取反，并根据状态值对selectedNum进行加减
            item.checked = !item.checked;
            item.checked ? ++this.selectedNum : --this.selectedNum;
            // 设置全选
            this.selectedNum === this.cart.length 
                ? this.checkAllFlag = true 
                : this.checkAllFlag = false
        },

        /**
         * @method 全选
         */
        checkAll: function () {
            var self = this;
            this.checkAllFlag = !this.checkAllFlag;

            this.cart.forEach(function (item) {
                if (self.checkAllFlag) {
                    // 全选
                    item.checked = true;
                    self.selectedNum = self.cart.length;
                } else {
                    // 取消全选
                    item.checked = false;
                    self.selectedNum = 0;
                }
            });
        },

        /**
         * @method 切换删除按钮
         */
        toggleDelBtn: function () {
            this.delFlag = !this.delFlag;
        },

        /**
         * @method 删除商品
         */
        delGoods: function () {
            /**
             * !提示：
             * 每次遍历删除数组元素时，会减少数组长度，所以不能缓存length
             * 也不能用forEach方法，因为它会自动缓存数组的长度
             * 这里还可以用filter
             */
            var cart = this.cart;
            this.cart = cart.filter(function (item) {
                return !item.checked
            });
            // for (var i = 0; i < cart.length; i++) {
            //     cart[i].checked && cart.splice(i--, 1);
            // };

            // 重置 被选商品数量、全选状态、删除状态
            this.selectedNum = 0;
            this.checkAllFlag = false;
            this.delFlag = !this.delFlag;
        }

    },
    computed: {
        /**
         * @method 已选商品的总额
         */
        totalPrice: function () {
            var num = 0;
            this.cart.forEach(function (item) {
                item.checked && (num += parseFloat(item.subtotal));
            });
            return num;
        }
    }
});