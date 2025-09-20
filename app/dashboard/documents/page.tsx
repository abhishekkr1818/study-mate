import { DocumentUpload } from "@/components/document-upload"
import { DocumentList } from "@/components/document-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText } from "lucide-react"

export default function DocumentsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-balance">Documents</h1>
        <p className="text-muted-foreground text-pretty">
          Upload and manage your PDF documents for AI-powered learning
        </p>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <DocumentUpload />
        </TabsContent>

        <TabsContent value="library" className="space-y-6">
          <DocumentList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
