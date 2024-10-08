from django.urls import path
from . import views

urlpatterns = [
    # for viewing or creating notes
    # path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    # for deleting notes
    # path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
]