from flask import jsonify


def success(data=None, message="Success"):

    return jsonify({

        "success": True,

        "message": message,

        "data": data

    })


def error(message, status=400):

    response = jsonify({

        "success": False,

        "message": message

    })

    response.status_code = status

    return response