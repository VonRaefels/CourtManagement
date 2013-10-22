var CategoriaView = Backbone.View.extend({
    id: function(){ return this.model.id; },
    tagName: 'li',
    className: 'categoria',
    template: Handlebars.compile($('#categoria-template').html()),
    events: {
        'click label[name=categoria]': 'clicked'
    },
    clicked: function(ev){
        ev.preventDefault();
        var idCategoria = this.model.get('_id');
        var model = this.model;
        var $el = this.$el;
        var $gruposElCollection = $el.find('#grupos');
        if(0 == $gruposElCollection.length){
            var grupos = new Grupos([], {idCategoria: idCategoria});
            grupos.fetch({success: function(collection, response, options){
                var grupoListView = new GrupoListView({collection: collection, categoria: model}).render();
                $el.append(grupoListView.el);
            }});
        }else{
            var $gruposEl = $($gruposElCollection[0]);
            $gruposEl.toggle();
        }
    },
    render: function(){
        this.$el.append(this.template(this.model.toJSON()));
        return this;
    },
    initialize: function(){
    }
});

var PistaView = Backbone.View.extend({
    id: function(){ return this.model.id; },
    tagName: 'div',
    className: 'pista',
    template: Handldebars.compile($('#pista-template').html()),
    render: function(){
        this.$el.append(this.template(this.model.toJSON()));
        return this;
    }
});