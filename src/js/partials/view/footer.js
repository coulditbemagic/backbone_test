var Footer = Backbone.View.extend({
    el: $(".page-footer"), // DOM элемент header

    template: _.template($('#footer').html()),

    initialize: function() {
        this.render();
    },

    render: function() {
        this.el.html( this.template() );
    }
});