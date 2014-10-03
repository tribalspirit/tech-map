/**
 * Created by Mykola_Turunov on 10/3/2014.
 */
$(document).ready(function () {


    var m_width = $("#map").width(),
        width = 938,
        height = 500,
        country,
        state,
        baseimg = 'images/flags/',
        baseimgext = '.gif';

    var projection = d3.geo.mercator()
        .scale(150)
        .translate([width / 2, height / 1.5]);

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select("#map").append("svg")
        .attr("preserveAspectRatio", "xMidYMid")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("width", m_width)
        .attr("height", m_width * height / width);

    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", country_clicked);

    var g = svg.append("g");

    d3.json("/api/map", function (error, us) {
        g.append("g")
            .attr("id", "countries")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.countries).features)
            .enter()
            .append("path")
            .attr("id", function (d) {
                return d.id;
            })
            .attr("d", path)
            .attr("class", function (d) {
                if(d.properties.data) {return "presence"}

            })
            .on("click", country_clicked)
            .on("mouseover", country_hover)
            .on("mouseout", country_hout);
    });

    function zoom(xyz) {
        g.transition()
            .duration(750)
            .attr("transform", "translate(" + projection.translate() + ")scale(" + xyz[2] + ")translate(-" + xyz[0] + ",-" + xyz[1] + ")")
            .selectAll(["#countries"])
            .style("stroke-width", 1.0 / xyz[2] + "px")
        ;
    }

    function get_xyz(d) {
        var bounds = path.bounds(d);
        var w_scale = (bounds[1][0] - bounds[0][0]) / width;
        var h_scale = (bounds[1][1] - bounds[0][1]) / height;
        var z = .96 / Math.max(w_scale, h_scale);
        var x = (bounds[1][0] + bounds[0][0]) / 2;
        var y = (bounds[1][1] + bounds[0][1]) / 2 + (height / z / 6);
        return [x, y, z];
    }



    function country_hover(d) {
        if(d && d.properties.data) {
            g.selectAll("#" + d.id).attr('class', 'highlight');
            $('#country').text(d.properties.name);
            $('#country-img').attr('src', baseimg + d.id + baseimgext).show();
            $('#country-desc').text(d.properties.description);

        }


    }


    function country_hout(d) {
        if(d && d.properties.data) {
            g.selectAll("#" + d.id).attr('class', 'presence');
            $('#country').html("&nbsp;");
            $('#country-desc').text("");
            $('#country-img').hide();
        }

    }


    function country_clicked(d) {

        zoom(get_xyz(d));

        if (d && d.properties.data) {
            $("#info").text(d.properties.data);

            event.preventDefault();
            $('#overlay').fadeIn(400,
                function () {
                    $('#info')
                        .css('display', 'block')
                        .animate({opacity: 1, top: '30%'}, 200);
                });

        }

    }

    $('#info_close, #overlay').click(function () {
        $('#info')
            .animate({opacity: 0, top: '35%'}, 200,
            function () {
                $(this).css('display', 'none');
                $('#overlay').fadeOut(400);
                svg.attr("viewBox", "0 0 " + width + " " + height);
            }
        );
    });

    $(window).resize(function () {
        var w = $("#map").width();
        svg.attr("width", w);
        svg.attr("height", w * height / width);
    });


})

