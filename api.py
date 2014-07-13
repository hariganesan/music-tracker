# Hari Ganesan 12/21/13
# main file for track-music

import os
import logging
import json

from google.appengine.ext.webapp import template
import webapp2

# spits a path to a request handler
def spitPath(self, path):
	fullPath = os.path.join(os.path.dirname(__file__), path)
	self.response.out.write(template.render(fullPath, {}))

#########################
# Static Handlers
#########################

# main routes to static pages
class MainPageHandler(webapp2.RequestHandler):
	def get(self):
		spitPath(self, "templates/index.html")


app = webapp2.WSGIApplication([
	('/.*$', MainPageHandler)
], debug=True)